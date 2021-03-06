(function (Q, $) {

/**
 * @module Streams-tools
 */

/**
 * Displays participants of a given stream in a horizontal list.
 * Each item in the list is presented with an avatar and also can have a contextual associated with it.
 * @class Streams participants
 * @constructor
 * @param {Object} options Provide options for this tool
 *   @param {String} options.publisherId The id of the publisher
 *   @param {String} options.streamName The name of the stream
 *   @param {Object} [options.invite] Pass an object here to pass as fields to 
 *     Streams/participants/invite template, otherwise the invite button doesn't appear.
 *   @param {Boolean} [options.showSummary] Whether to show a summary
 *   @param {Boolean} [options.showBlanks] Whether to show blank avatars in place of remaining spots
 *   @param {Number} [options.max]
 *    The number, if any, to show in the denominator of the summary
 *   @param {Number} [options.maxShow=10]
 *    The maximum number of participants to fetch for display
 *   @param {Function} [options.filter]
 *    Takes (userId, element) and can modify them.
 *    If this function returns false, the element is not appended.
 *   @param {Q.Event} [options.onRefresh] An event that occurs when the tool is refreshed
 */
Q.Tool.define("Streams/participants",

function _Streams_participants(options) {
	
	var tool = this;
	var state = tool.state;
	
	if (!state.publisherId) {
		throw new Q.Error("Streams/chat: missing publisherId option");
	}
	if (!state.streamName) {
		throw new Q.Error("Streams/chat: missing streamName option");
	}
	
	tool.Q.onStateChanged('count').set(function (name) {
		var c = state.count;
		tool.$count.text(c >= 100 ? '99+' : c.toString());
		if (state.showSummary) {
			tool.$summary.show().plugin('Q/textfill', 'refresh');
		} else {
			tool.$summary.hide();
		}
	}, tool);
	
	tool.refresh(function () {
		tool.forEachChild('Users/avatar', function () {
			tool.$elements[this.state.userId] = $(this.element);
		});
	});
},

{
	invite: {
		appUrl: function () {
			return location.href;
		}
	},
	maxShow: 10,
	maxLoad: 100,
	max: null,
	filter: function () { },
	avatar: {
		"short": true,
		icon: (window.devicePixelRatio > 1 ? '80' : '40'),
		reflectChanges: false
	},
	showSummary: true,
	showControls: false,
	showBlanks: false,
	onRefresh: new Q.Event(),
	onInvited: new Q.Event(),
	templates: {
		invite: {
			name: 'Streams/participants/invite',
			fields: { 
				src: Q.Streams.iconUrl('labels/Streams/invited', 40), 
				alt: 'Invite', 
				title: 'Invite'
			}
		}
	}
},

{
	Q: {
		beforeRemove: function () {
			clearInterval(this.adjustInterval);
		}
	},
	/**
	 * Refresh the participants tool
	 * @method refresh
	 * @param {Function} callback pass a callback to be called after the refresh is done
	 */
	refresh: function (callback) {
		var tool = this;
		var state = tool.state;
		var $te = $(tool.element);
		tool.$elements = {};

		if (state.rendered) {
			tool.$count = $('.Streams_participants_count', $te);
			tool.$max = $('.Streams_participants_max', $te);
			tool.$summary = $('.Streams_participants_summary', $te);
			tool.$controls = $('.Streams_participants_controls', $te);
			tool.$pei = $('.Streams_participants_expand_img', $te);
			tool.$pet = $('.Streams_participants_expand_text', $te);
			tool.$pc = $('.Streams_participants_container', $te);
			tool.$avatars = $('.Streams_participants_avatars', $te);
			tool.$blanks = $('.Streams_participants_blanks', $te);
			_continue();
			return false;
		}
		
		tool.$count = $("<span class='Streams_participants_count'></span>");
		tool.$max = $("<span class='Streams_participants_max'></span>");
		tool.$pet = $("<span class='Streams_participants_expand_text'>See All</span>");
		tool.$pei = $('<img class="Streams_participants_expand_img" />').attr({
			src: Q.url('{{Q}}/img/expand.png'),
			alt: "expand"
		});
		tool.$controls = $("<div class='Streams_participants_controls' />")
			.append(
				$("<div class='Streams_participants_expand' />")
				.append(tool.$pei, tool.$pet)
			).appendTo($te);
		tool.$summary = $("<div class='Streams_participants_summary' />")
			.append($('<span />').append(tool.$count, tool.$max))
			.appendTo($te);
		tool.$pc = $("<div class='Streams_participants_container' />")
			.appendTo($te);
		tool.$avatars = $("<span class='Streams_participants_avatars' />")
			.appendTo(tool.$pc);
		tool.$blanks = $("<span class='Streams_participants_blanks' />")
			.appendTo(tool.$pc);

		// set expand icon click event
		tool.$pei.plugin('Q/clickable').on(Q.Pointer.fastclick, function () {
			if (state.expanded) {
				tool.$blanks.show();
				$te.animate({height: state.originalHeight}, function () {
					state.expanded = false;
				});
				tool.$pei.attr({
					src: Q.url('{{Q}}/img/expand.png'),
					alt: 'expand'
				});
				tool.$pet.html('See All');
			} else {
				state.originalHeight = $te.height();
				tool.$blanks.hide();
				$te.animate({height: tool.$pc.height()}, function () {
					state.expanded = true;
				});
				tool.$pei.attr({
					src: Q.url('{{Q}}/img/collapse.png'),
					alt: 'collapse'
				});
				tool.$pet.html('Fewer');
			}
		});

		$te.addClass('Streams_participants_loading');
		Q.Streams.get(state.publisherId, state.streamName, function (err, stream, extra) {
			var fem = Q.firstErrorMessage(err);
			if (fem) {
				return console.warn("Streams/participants: " + fem);
			}
			if (!$(tool.element).closest('body').length) {
				return;
			}
			tool.stream = this;
			var i = 0, c = 0;
			$te.removeClass('Streams_participants_loading');
			Q.Tool.clear(tool.$avatars[0]);
			Q.Tool.clear(tool.$blanks[0]);
			tool.$avatars.empty();
			tool.$blanks.empty();
			Q.each(extra && extra.participants, function (userId, participant) {
				if (participant.state !== 'participating') {
					return;
				}
				++c;
				if (!state.maxShow || ++i <= state.maxShow) {
					_addAvatar(userId);
				}
			}, { sort: 'insertedTime', ascending: false });
			state.count = c;
			if (state.showBlanks) {
				Q.each(c, state.maxShow-1, 1, function () {
					_addAvatar('');
				});
			}
			_continue();

		}, {participants: state.maxLoad});
		return true;
		
		function _continue() {
			tool.stateChanged('count');

			tool.adjustInterval = setInterval(_adjustInterval, 500);

			if (state.max) {
				tool.$max.text('/' + state.max);
			}
			
			Q.Streams.retainWith(tool).get(state.publisherId, state.streamName, function () {
				var stream = this;
				stream.onMessage("Streams/join")
				.set(function (stream, message, messages) {
					_addAvatar(message.byUserId, true);
					++tool.state.count;
					tool.stateChanged('count');
				}, tool);
				stream.onMessage("Streams/leave")
				.set(function (stream, message, messages) {
					_removeAvatar(message.byUserId);
					--tool.state.count;
					tool.stateChanged('count');
				}, tool);
				var si = state.invite;
				if (!si || !stream.testAdminLevel('invite')) {
					Q.handle(callback, tool, []);
					return Q.handle(state.onRefresh, tool, []);
				}
				if (tool.$('.Streams_inviteTrigger').length) {
					return; // the invite button already rendered
				}
				Q.Text.get("Streams/content", function (err, result) {
					var text = result && result.invite;
					if (text) {
						state.templates.invite.fields.alt = text.command;
						state.templates.invite.fields.title = text.command;
					}
					Q.Template.render(
						'Streams/participants/invite',
						state.templates.invite.fields,
						function (err, html) {
							if (err) return;
							var $element = tool.$invite = $(html).insertBefore(tool.$avatars);
							var filter = '.Streams_inviteTrigger';
							$(tool.element).on(Q.Pointer.fastclick, filter, function () {
								var options = Q.extend({
									identifier: si.identifier
								}, si);
								Q.Streams.invite(
									state.publisherId, 
									state.streamName, 
									options,
									function (err, data) {
										state.onInvited.handle.call(tool, err, data);
									}
								);
								return false;
							}).on(Q.Pointer.click, filter, function () {
								return false;
							}).on(Q.Pointer.start.eventName, filter, function () {
								$(tool.element).addClass('Q_discouragePointerEvents');
								function _pointerEndHandler() {
									$(tool.element).removeClass('Q_discouragePointerEvents');
									$(window).off(Q.Pointer.end, _pointerEndHandler);
								}
								$(window).on(Q.Pointer.end, _pointerEndHandler);
							});

							if (si.clickable) {
								$('img', $element).plugin(
									'Q/clickable', Q.extend({
										triggers: $element
									}, si.clickable)
								);
							}
							Q.handle(callback, tool, []);
							Q.handle(state.onRefresh, tool, []);
						},
						state.templates.invite
					);
				});
			});
		}

		function _addAvatar(userId, prepend, participant) {
			var $e = userId ? tool.$avatars : tool.$blanks;
			if (userId && $(".Users_avatar_tool[id*=" + userId + "]", $e).length) {
				return;
			}

			var $element = $(Q.Tool.setUpElement(
				'div', 
				'Users/avatar',
				Q.extend({}, state.avatar, {
					userId: userId,
				}),
				userId || null, 
				tool.prefix)
			);
			if (false !== Q.handle(state.filter, tool, [userId, $element[0]])) {
				$element[prepend?'prependTo':'appendTo']($e).activate();
			}
		}
		
		function _removeAvatar(userId) {
			var $element = tool.$elements[userId];
			if ($element) {
				Q.removeElement($element[0], true);
			}
		}

		function _adjustInterval() {
			var w = $te.width();
			var pm = tool.$pc.outerWidth(true) - tool.$pc.width();
			if (state.showSummary) {
				w = w - tool.$summary.outerWidth(true);
			}
			if (state.showControls) {
				w = w - tool.$controls.outerWidth(true);
				var $pcw = tool.$pc.innerWidth();
				var avatarsWidth = 0;
				$(".Streams_participants_invite", tool.$pc).add(".Users_avatar_tool", tool.$avatars).each(function () {
					avatarsWidth += $(this).outerWidth(true);
				});
				var overflowed = ($pcw > 0 && avatarsWidth > $pcw);
				if (overflowed) {
					if (!state.overflowed) {
						$te.addClass('Q_overflowed');
					}
				} else {
					$te.removeClass('Q_overflowed');
					tool.$blanks.show();
				}
				state.overflowed = overflowed;
			}

			tool.$pc.width(w - pm);
		}
	}
}

);

Q.Template.set('Streams/participants/invite',
	'<div class="Streams_participants_invite Streams_inviteTrigger">' +
	'	<img src="{{& src}}" alt="{{alt}}">' +
	'	<div class="Streams_invite_label">{{& title}}</div>' +
	'</div>'
);

})(Q, jQuery);