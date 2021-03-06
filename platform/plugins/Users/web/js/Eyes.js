(function (Q, $) {

    var Users = Q.plugins.Users;
    var _debug = null;

    /**
     * Analyses what user is watching on screen
     * @class Users.Eyes
     * @constructor
     */
    Users.Eyes =  function Users_Eyes() {}

    /**
     * Instance of webgazer (only one instance is possible)
     * @class Users.webgazerInstance
     * @constructor
     */
    Users.Eyes.webgazerInstance = null

    /**
     * Start webcam eye tracking on the browser.
     * @method Eyes.start
     * @param {Object} options options for the method
     * @param {Function} [options.stream] Video stream which are processed
     * @param {Function} [options.onChange] Callback called when eyes points are changing
     * @param {Function} [options.onEnter] Callback called when eyes points are within the viewport
     * @param {Function} [options.onLeave] Callback called when eyes points leaves viewport
     */
    Users.Eyes.start = function (options) {
        var webgazerInstance = null;

        options = Q.extend({
            stream: null,
            onChange: new Q.Event(),
            onEnter: new Q.Event(),
            onLeave: new Q.Event()
        }, options);

        if(Users.Eyes.webgazerInstance == null) {
            if(findScript('{{Users}}/js/webgazer.js')) {
                Users.Eyes.webgazerInstance = webgazerInstance = webgazer;
                init();

            } else {
                Q.addScript('{{Users}}/js/webgazer.js', function () {
                    webgazerInstance = Users.Eyes.webgazerInstance;
                    init();
                });
            }
        } else {
            webgazerInstance = Users.Eyes.webgazerInstance
        }

        function init() {



            if(options.stream != null) {
                startTracking(options.stream)
            } else {
                navigator.mediaDevices.getUserMedia ({
                    'audio': false,
                    'video': true
                }).then(function (stream) {
                    startTracking(stream);
                }).catch(function(err) {
                    console.error('EYES TRACKING ERROR' + err.name + ": " + err.message);
                });
            }
        }

        async function startTracking(stream) {
            // Kalman Filter defaults to on. Can be toggled by user.
            window.applyKalmanFilter = true;
            // Set to true if you want to save the data even if you reload the page.
            window.saveDataAcrossSessions = true;

            //start the webgazer tracker
            webgazerInstance = await webgazer.setRegression('ridge') /* currently must set regression and tracker */
            //.setTracker('clmtrackr')
                .setStaticVideo(stream)
                .setGazeListener(function(data, clock) {
                    options.onChange.handle.call(data);
                    //console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                    //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */

                }).begin(function(e){
                    console.error(e)
                });



            window.onbeforeunload = function() {
                webgazerInstance.end();
            }

            webgazerInstance.showVideo(false);
            webgazerInstance.showFaceOverlay(false);
            webgazerInstance.showFaceFeedbackBox(false);
            webgazerInstance.showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
            //Set up the webgazer video feedback.
            var setup = function() {
                //Set up the main canvas. The main canvas is used to calibrate the webgazer.
                var canvas = document.getElementById("plotting_canvas");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.style.position = 'fixed';
            };
            setup();

        }

    }

    Users.Eyes.stop = function () {
        if(Users.Eyes.webgazerInstance != null) {
            Users.Eyes.webgazerInstance.end();
        }
    }

    var findScript = function (src) {
        var scripts = document.getElementsByTagName('script');
        var src = Q.url(src);
        for (var i=0; i<scripts.length; ++i) {
            var srcTag = scripts[i].getAttribute('src');
            if (srcTag && srcTag.indexOf(src) != -1) {
                return true;
            }
        }
        return null;
    };
})(Q, jQuery);
