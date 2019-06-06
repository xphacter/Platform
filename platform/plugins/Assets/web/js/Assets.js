(function (Q, Assets, Streams, $) {

	/**
	 * Various front-end functionality dealing with awards, badges, credits, etc.
	 * @class Assets
	 */

	Q.text.Assets = {
		subscriptions: {
			infoTitle: "Set Payment Information",
			confirm: {
				title: "Start Subscription",
				message: "Would you like to subscribe to {{title}}?",
				ok: "OK",
				cancel: "Cancel"
			}
		},
		payments: {
			infoTitle: "Set Payment Information",
			confirm: {
				title: "Make a Payment",
				message: "Do you agree to pay {{symbol}}{{amount}}?",
				ok: "OK",
				cancel: "Cancel"
			}
		}
	};

	var Users = Q.Users;
	Streams = Q.Streams;
	Assets = Q.Assets = Q.plugins.Assets = {

		/**
		 * Operates with credits.
		 * @class Assets.Credits
		 */

		Credits: {
			/**
			 * Get the Assets/user/credits stream published by the logged-in user, if any
			 * @method userStream
			 *  @param {Function} [callback] The function to call, receives (err, stream)
			 */
			userStream: function (callback) {
				if (!Users.loggedInUser) {
					callback(new Q.Error("Credits/userStream: not logged in"), null);
					return false;
				}
				Streams.get(Users.loggedInUser.id, "Assets/user/credits", callback);
			}
		},

		onSuccessPayment: new Q.Event(),

		/**
		 * Operates with subscriptions.
		 * @class Assets.Subscriptions
		 */
		Subscriptions: {
			/**
			 * Show an authnet dialog where the user can choose their payment profile,
			 * then show a confirmation box, and then start a subscription with that
			 * payment profile.
			 * @method authnet
			 * @static
			 *  @param {Object} [options] Any additional options to pass to the dialog, and also:
			 *  @param {String} [options.planPublisherId=Q.Users.communityId] The publisherId of the subscription plan
			 *  @param {String} [options.planStreamName="Assets/plan/main"] The name of the subscription plan's stream
			 *  @param {String} [options.action] Required. Should be generated with Assets/subscription tool.
			 *  @param {String} [options.token] Required. Should be generated with Assets/subscription tool.
			 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
			 */
			authnet: function (options, callback) {
				var o = Q.extend({},
					Q.text.Assets.subscriptions,
					Assets.Subscriptions.authnet.options,
					options
				);
				Streams.get(o.planPublisherId, o.planStreamName, function (err) {
					if (err) {
						return callback && callback(err);
					}
					var plan = this;
					if (!o.action || !o.token) {
						throw new Q.Error("Assets.Subscriptions.authnet: action and token are required");
					}
					var $form = $('<form  method="post" target="Assets_authnet" />')
						.attr('action', o.action)
						.append($('<input name="Token" type="hidden" />').val(o.token));
					var html = '<iframe ' +
						'class="Assets_authnet" ' +
						'name="Assets_authnet" ' +
						'src="" ' +
						'frameborder="0" ' +
						'scrolling="yes" ' +
						'></iframe>';
					Q.Dialogs.push(Q.extend({
						title: o.infoTitle,
						apply: true,
						onActivate: {
							"Assets": function () {
								$form.submit();
							}
						},
						onClose: {
							"Assets": function () {
								// TODO: don't do the subscription if payment info wasn't added
								var message = o.confirm.message.interpolate({
									title: plan.fields.title,
									name: o.name
								});
								Q.extend(o, Q.text.Assets.subscriptions.confirm);
								Q.confirm(message, function (result) {
									if (!result) return;
									Assets.Subscriptions.subscribe('authnet', o, callback);
								}, o);
							}
						}
					}, options, {
						content: html
					}));
				});
			},

			/**
			 * Show a stripe dialog where the user can choose their payment profile
			 * and then start a subscription with that payment profile.
			 * @method stripe
			 * @static
			 *  @param {Object} [options] Any additional options to pass to the stripe checkout config, which include things like:
			 *  @param {String} [options.planPublisherId=Q.Users.communityId] The publisherId of the subscription plan
			 *  @param {String} [options.planStreamName="Assets/plan/main"] The name of the subscription plan's stream
			 *  @param {String} [options.action] Required. Should be generated with Assets/subscription tool.
			 *  @param {String} [options.token] Required. Should be generated with Assets/subscription tool.
			 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
			 */
			stripe: function (options, callback) {
				var o = Q.extend({
					confirm: Q.text.Assets.subscriptions.confirm
				}, Assets.Subscriptions.stripe.options, options);
				Streams.get(o.planPublisherId, o.planStreamName, function (err) {
					if (err) {
						return callback && callback(err);
					}
					var plan = this;
					Q.addScript(o.javascript, function () {
						var params = Q.extend({
							name: o.name,
							description: plan.fields.title,
							amount: plan.getAttribute('amount')
						}, o);
						params.amount *= 100;
						StripeCheckout.configure(Q.extend({
							key: Assets.Payments.stripe.publishableKey,
							token: function (token) {
								o.token = token;
								Assets.Subscriptions.subscribe('stripe', o, callback);
							}
						}, params)).open();
					});
				});
			},

			/**
			 * Subscribe the logged-in user to a particular payment plan
			 * @method subscribe
			 * @static
			 *  @param {String} payments can be "authnet" or "stripe"
			 *  @param {Object} options Any additional options, which should include:
			 *  @param {String} options.planPublisherId The publisherId of the subscription plan
			 *  @param {String} options.planStreamName The name of the subscription plan's stream
			 *  @param {String} options.token the token obtained from the hosted forms
			 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
			 */
			subscribe: function (payments, options, callback) {
				var fields = {
					payments: payments,
					planPublisherId: options.planPublisherId,
					planStreamName: options.planStreamName,
					token: options.token
				};
				Q.req('Assets/subscription', 'subscription', function (err, response) {
					var msg;
					if (msg = Q.firstErrorMessage(err, response && response.errors)) {
						return callback(msg, null);
					}
					Q.handle(callback, this, [null, response.slots.payment]);
				}, {
					method: 'post',
					fields: fields
				});
			}
		},

		/**
		 * Operates with payments
		 * @class Assets.Payments
		 */
		Payments: {
			/**
			 * Show an authnet dialog where the user can choose their payment profile,
			 * then show a confirmation box to make a payment, and then charge that
			 * payment profile.
			 * @method authnet
			 * @static
			 *  @param {Object} [options] Any additional options to pass to the dialog, and also:
			 *  @param {Number} options.amount the amount to pay.
			 *  @param {String} [options.action] Required. Should be generated with Assets/payment tool.
			 *  @param {String} [options.token] Required. Should be generated with Assets/payment tool.
			 *  @param {String} [options.publisherId=Q.Users.communityId] The publisherId of the Assets/product or Assets/service stream
			 *  @param {String} [options.streamName] The name of the Assets/product or Assets/service stream
			 *  @param {String} [options.description] A short name or description of the product or service being purchased.
			 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
			 */
			authnet: function (options, callback) {
				var o = Q.extend({},
					Q.text.Assets.payments,
					Assets.Payments.authnet.options,
					options
				);
				if (!o.action || !o.token) {
					throw new Q.Error("Assets.Payments.authnet: action and token are required");
				}
				if (!o.amount) {
					throw new Q.Error("Assets.Payments.authnet: amount is required");
				}
				var $form = $('<form method="post" target="Assets_authnet" />')
					.attr('action', o.action)
					.append($('<input name="Token" type="hidden" />').val(o.token));
				var html = '<iframe ' +
					'class="Assets_authnet" ' +
					'name="Assets_authnet" ' +
					'src="" ' +
					'frameborder="0" ' +
					'scrolling="yes" ' +
					'></iframe>';
				Q.Dialogs.push(Q.extend({
					title: o.infoTitle,
					apply: true,
					onActivate: {
						"Assets": function () {
							$form.submit();
						}
					},
					onClose: {
						"Assets": function () {
							// TODO: don't do the payment if info wasn't added
							Assets.Currencies.load(function () {
								var message = o.confirm.message.interpolate({
									amount: o.amount,
									name: o.name,
									symbol: Assets.Currencies.symbols.USD
								});
								Q.extend(o, Q.text.Assets.payments.confirm);
								Q.confirm(message, function (result) {
									if (!result) return;
									Assets.Payments.pay('authnet', o, callback);
								}, o);
							});
						}
					}
				}, options, {
					content: html
				}));
			},

			/**
			 * Show a stripe dialog where the user can choose their payment profile
			 * and then charge that payment profile.
			 * @method stripe
			 * @static
			 *  @param {Object} [options] Any additional options to pass to the stripe checkout config, and also:
			 *  @param {Number} options.amount the amount to pay.
			 *  @param {String} [options.currency="usd"] the currency to pay in.
			 *  @param {String} [options.publisherId=Q.Users.communityId] The publisherId of the Assets/product or Assets/service stream
			 *  @param {String} [options.streamName] The name of the Assets/product or Assets/service stream
			 *  @param {String} [options.name=Users::communityName()] The name of the organization the user will be paying
			 *  @param {String} [options.image] The url pointing to a square image of your brand or product. The recommended minimum size is 128x128px.
			 *  @param {String} [options.description] A short name or description of the product or service being purchased.
			 *  @param {String} [options.panelLabel] The label of the payment button in the Stripe Checkout form (e.g. "Pay {{amount}}", etc.). If you include {{amount}}, it will be replaced by the provided amount. Otherwise, the amount will be appended to the end of your label.
			 *  @param {String} [options.zipCode] Specify whether Stripe Checkout should validate the billing ZIP code (true or false). The default is false.
			 *  @param {Boolean} [options.billingAddress] Specify whether Stripe Checkout should collect the user's billing address (true or false). The default is false.
			 *  @param {Boolean} [options.shippingAddress] Specify whether Checkout should collect the user's shipping address (true or false). The default is false.
			 *  @param {String} [options.email] Set the email address, if any, provided to Stripe Checkout to be pre-filled.
			 *  @param {Boolean} [options.allowRememberMe=true] Specify whether to include the option to "Remember Me" for future purchases (true or false).
			 *  @param {Boolean} [options.bitcoin=false] Specify whether to accept Bitcoin (true or false).
			 *  @param {Boolean} [options.alipay=false] Specify whether to accept Alipay ('auto', true, or false).
			 *  @param {Boolean} [options.alipayReusable=false] Specify if you need reusable access to the customer's Alipay account (true or false).
			 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
			 */
			stripe: function (options, callback) {
				var err;
				options = Q.extend({},
					Q.text.Assets.payments,
					Assets.Payments.stripe.options,
					options
				);
				if (!options.amount) {
					err = _error("Assets.Payments.stripe: amount is required");
					return Q.handle(callback, null, [err]);
				}

				options.userId = options.userId || Q.Users.loggedInUserId();

				try {
					Stripe.setPublishableKey(Assets.Payments.stripe.publishableKey);
				} catch (err) {
					err = _error('Please preload Stripe js library');
					return Q.handle(callback, null, [err]);
				}
				if (!Q.info.isCordova && Q.info.platform === 'ios' && Q.info.browser.name === 'safari') { // It's considered that ApplePay is supported in IOS Safari
					_applePayStripe(options, function (err, res) {
						if (err && (err.code === 21)) { // code 21 means that this type of payment is not supported in some reason
							_standardStripe(options, callback);
							return;
						}

						Q.handle(callback, null, [err, res]);
					});
				} else if (Q.info.isCordova && window.ApplePay) { // check for payment request
					_appleCordovaPay(options, function (err, res) {
						if (err) {
							return _standardStripe(options, callback);
						}
						Q.handle(callback, null, [err, res]);
					});
				} else if (false && window.PaymentRequest) {
					// check for payment request
					// this method turned off because stripe offer universal interface
					// which allow to select saved cards from browser and googlePay.
					// But using window.PaymentRequest with googlePay require to get
					// merchantId from google (which long and dreary). Instructions to get merchantId:
					// https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist
					_paymentRequestStripe(options, function (err, res) {
						if (err && (err.code === 9)) {
							_standardStripe(options, callback);
							return;
						}
						Q.handle(callback, null, [err, res]);
					});
				} else {
					if (Q.info.isCordova && (window.location.href.indexOf('browsertab=yes') === -1)) {
						_redirectToBrowserTab(options);
					} else {
						_standardStripe(options, callback);
					}
				}
			},
			/**
			 * This method use googlePay
			 * and then charge that payment profile.
			 * @method googlepay
			 * @static
			 *  @param {Object} [options] Any additional options to pass to the stripe checkout config, and also:
			 *  @param {Number} options.amount the amount to pay.
			 *  @param {String} [options.currency="usd"] the currency to pay in.
			 *  @param {Function} [callback]
			 */
			googlepay: function (options, callback) {
				// while we fixing problems with GoolePay
				return _standardStripe(options, callback);

				sgap.setKey(Assets.Payments.stripe.publishableKey).then(function () {
					sgap.isReadyToPay()
				}).then(function () {
					sgap.requestPayment(options.amount, options.currency).then(function (token) {
						options.token = token;
						Assets.Payments.pay('stripe', options, callback);
					});
				}).catch(function (err) {
					Q.handle(callback, this, [err])
				});
			},
			/**
			 * Charge the user once you've obtained a token
			 * @method pay
			 *  @param {String} payments can be "authnet" or "stripe"
			 *  @param {Object} options Any additional options, which include:
			 *  @param {String} [options.publisherId=Q.Users.communityId] The publisherId of the Assets/product or Assets/service stream
			 *  @param {String} [options.streamName] The name of the Assets/product or Assets/service stream
			 *  @param {Number} options.description A short name or description of the product or service being purchased.
			 *  @param {Number} options.amount the amount to pay.
			 *  @param {String} [options.currency="usd"] the currency to pay in. (authnet supports only "usd")
			 *  @param {String} [options.token] the token obtained from the hosted forms
			 *  @param {String} [options.userId] logged in userId, needed for cordova ios / android payments
			 *  @param {Function} [callback] The function to call, receives (err, paymentSlot)
			 */
			pay: function (payments, options, callback) {
				var fields = {
					payments: payments,
					publisherId: options.publisherId,
					streamName: options.streamName,
					token: options.token,
					amount: options.amount,
					description: options.description,
					userId: options.userId

				};
				Q.req('Assets/payment', 'charge', function (err, response) {
					var msg;
					if (msg = Q.firstErrorMessage(err, response && response.errors)) {
						return callback(msg, null);
					}
					Q.handle(callback, this, [null, response.slots.charge]);
					Assets.onSuccessPayment.handle(response);
				}, {
					method: 'post',
					fields: fields
				});
			}
		},

		/**
		 * For dealing with currencies
		 * @class Assets.Currencies
		 */
		Currencies: {
			/**
			 * @method load
			 * @static
			 * Use this to load currency data into Q.Assets.Currencies
			 * @param {Function} callback Once the callback is called,
			 *   Q.Assets.Currencies.symbols and Q.Assets.Currencies.names is accessible
			 */
			load: function (callback) {
				Q.addScript('{{Assets}}/js/lib/currencies.js', callback);
			},
			symbols: null,
			names: null
		}
	};

	Assets.Subscriptions.authnet.options = {
		planPublisherId: Users.communityId,
		planStreamName: "Assets/plan/main",
		name: Users.communityName
	};
	Assets.Subscriptions.stripe.options = {
		planPublisherId: Users.communityId,
		planStreamName: "Assets/plan/main",
		javascript: 'https://checkout.stripe.com/checkout.js',
		name: Users.communityName
	};
	Assets.Payments.authnet.options = {
		name: Users.communityName,
		description: 'a product or service'
	};
	Assets.Payments.stripe.options = {
		description: 'a product or service',
		javascript: 'https://checkout.stripe.com/checkout.js',
		name: Users.communityName
	};

	Q.Tool.define({
		"Assets/subscription": "{{Assets}}/js/tools/subscription.js",
		"Assets/payment": "{{Assets}}/js/tools/payment.js"
	});
	
	Q.onInit.set(function () {
		if (Q.info.platform === 'ios' && Q.getObject("Stripe.applePay.checkAvailability")) {
			Stripe.setPublishableKey(Assets.Payments.stripe.publishableKey);
			Stripe.applePay.checkAvailability(function (available) {
				Assets.Payments.stripe.applePayAvailable = available;
			});
		}
	}, 'Assets');

	function _appleCordovaPay (options, callback) {
		var supportedNetworks = ['amex', 'discover', 'masterCard', 'visa'];
		var merchantCapabilities = ['3ds', 'debit', 'credit'];

		ApplePay.canMakePayments({
			// supportedNetworks should not be an empty array. The supported networks currently are: amex, discover, masterCard, visa
			supportedNetworks: supportedNetworks,

			// when merchantCapabilities is passed in, supportedNetworks must also be provided. Valid values: 3ds, debit, credit, emv
			merchantCapabilities: merchantCapabilities
		}).then((message) => {
			ApplePay.makePaymentRequest({
				items: [{
					label: options.description,
					amount: options.amount
				}],
				supportedNetworks: supportedNetworks,
				merchantCapabilities: merchantCapabilities,
				merchantIdentifier: 'merchant.com.qbix.yang2020',
				currencyCode: options.currency.toUpperCase(),
				countryCode: 'US',
				billingAddressRequirement: 'none',
				shippingAddressRequirement: 'none',
				shippingType: 'service'
			}).then((paymentResponse) => {
				// paymentResponse.paymentData - base64 encoded token
				options.token = atob(paymentResponse.paymentData);
				Q.Assets.Payments.pay('stripe', options, function (err) {
					if (err) {
						return console.error(err);
					}
				});
			});
		}).catch((err) => {
			Q.handle(callback, null, [err]);
		});
	}

	function _applePayStripe(options, callback) {
		if (!Assets.Payments.stripe.applePayAvailable) {
			return callback(_error('Apple pay is not available', 21));
		}
		var request = {
			currencyCode: options.currency.toUpperCase(),
			countryCode: options.countryCode ? options.countryCode : 'US',
			total: {
				label: options.description,
				amount: options.amount
			}
		};
		var session = Stripe && Stripe.applePay.buildSession(request, 
		function (result, completion) {
			options.token = result.token;
			Q.Assets.Payments.pay('stripe', options, function (err) {
				if (err) {
					completion(ApplePaySession.STATUS_FAILURE);
					callback(err);
				} else {
					completion(ApplePaySession.STATUS_SUCCESS);
					callback(null, true);
				}
			});
		}, function (err) {
			callback(err);
		});
		session.oncancel = function () {
			callback(_error("Request cancelled", 20));
		};
		session.begin();
	}

	function _paymentRequestStripe(options, callback) {
		var supportedInstruments = [
			{
				supportedMethods: 'basic-card',
				data: {
					supportedNetworks: ['amex', 'discover', 'mastercard', 'visa'],
					supportedTypes: ['credit']
				}
			}
		];
		if (Assets.Payments.googlePay) {
			supportedInstruments.push({
				supportedMethods: 'https://google.com/pay',
				data: {
					environment: Assets.Payments.googlePay.environment,
					apiVersion: 2,
					apiVersionMinor: 0,
					merchantInfo: {
						// A merchant ID is available after approval by Google.
						// @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
						merchantId: Assets.Payments.googlePay.merchantId,
						merchantName: Assets.Payments.googlePay.merchantName
					},
					allowedPaymentMethods: [{
						type: 'CARD',
						parameters: {
							allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
							allowedCardNetworks: ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"]
						},
						tokenizationSpecification: {
							type: 'PAYMENT_GATEWAY',
							// Check with your payment gateway on the parameters to pass.
							// @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway}
							parameters: {
								'gateway': Assets.Payments.googlePay.gateway,
								'gatewayMerchantId': Assets.Payments.stripe.publishableKey
							}
						}
					}]
				}
			})
		}
		var details = {
			total: {
				label: options.description ? options.description : 'Total due',
				amount: {currency: options.currency ? options.currency : 'USD', value: options.amount}
			}
		};
		var request = new PaymentRequest(supportedInstruments, details, {requestPayerEmail: true});
		request.show().then(function (result) {
			var promise;
			if (result.methodName === 'basic-card') {
				promise = new Promise(function (resolve, reject) {
					Stripe.setPublishableKey(Assets.Payments.stripe.publishableKey);
					Stripe.card.createToken({
						number: result.details.cardNumber,
						cvc: result.details.cardSecurityCode,
						exp_month: result.details.expiryMonth,
						exp_year: result.details.expiryYear
					}, function (res, token) {
						if (res !== 200) {
							return reject({result: result, err: new Error('Stripe gateway error')});
						}
						options.token = token;
						return Q.Assets.Payments.pay('stripe', options, function (err) {
							if (err) {
								return reject({result: result, err: err});
							}
							return resolve(result);
						});
					});
				});
			}
			if (result.methodName === 'https://google.com/pay') {
				promise = new Promise(function (resolve, reject) {
					options.token = JSON.parse(result.details.paymentMethodToken);
					return Q.Assets.Payments.pay('stripe', options, function (err) {
						if (err) {
							return reject({result: result, err: err});
						}
						return resolve(result);
					});
				});
			}
			return promise ? promise : Promise.reject({result: result, err: new Error('Unsupported method')});
		}).then(function (result) {
			result.complete('success');
			callback(null, result);
		}).catch(function (err) {
			if (err.result && err.result.complete) {
				err.result.complete('fail');
			}
			callback(err);
		});
	}

	function _standardStripe(options, callback) {
		Q.addScript(options.javascript, function () {
			var token_triggered = false;
			StripeCheckout.configure({
				key: Assets.Payments.stripe.publishableKey,
				name: options.name,
				description: options.description,
				amount: options.amount * 100,
				closed: function() {
					if (!token_triggered) {
						callback(_error("Request cancelled", 20));
					}
				},
				token: function (token) {
					token_triggered = true;
					options.token = token;
					Assets.Payments.pay('stripe', options, callback);
				}
			}).open();
		});
	}

	function _error(message, code) {
		var err = new Q.Error(message);
		if (code) {
			err.code = code;
		}
		console.warn(err);
		return err;
	}

	function _redirectToBrowserTab(paymentOptions) {
		var url = new URL(document.location.href);
		url.searchParams.set('browsertab', 'yes');
		paymentOptions.userId = Q.Users.loggedInUserId();
		url.searchParams.set('paymentOptions', JSON.stringify(paymentOptions));
		cordova.plugins.browsertab.openUrl(url.toString());
	}

	if (window.location.href.indexOf('browsertab=yes') !== -1) {
		window.onload = function() {
			var params = new URLSearchParams(document.location.href);
			try {
				var paymentOptions = JSON.parse(params.get('paymentOptions'));
			} catch(err) {
				console.warn('Undefined payment options');
				throw(err);
			}
			if ((Q.info.platform === 'ios') && (Q.info.browser.name === 'safari')) { // It's considered that ApplePay is supported in IOS Safari
				var $button = $('#browsertab_pay');
				var $info = $('#browsertab_pay_info');
				var $cancel = $('#browsertab_pay_cancel');
				var $error = $('#browsertab_pay_error');
				$button.show();
				$button.on('click', function() {
					Assets.Payments.stripe(paymentOptions, function(err, res){
						$button.hide();
						if (err && err.code === 20) {
							$cancel.show();
						} else if (err) {
							$error.show();
						} else {
							$info.show();
						}
					})
				});
			} else {
				Assets.Payments.stripe(paymentOptions, function(){
					window.close();
				})
			}
		};
	}


})(Q, Q.plugins.Assets, Q.plugins.Streams, jQuery);