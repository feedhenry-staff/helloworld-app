var TOTAL = 20 * 60 * 1000;     // N minutes
var SLEEP_PERIOD = 10 * 1000;   // wake up every M seconds, log something and sleep again

module.exports = function (ctx) {
    var deferral = ctx.requireCordovaModule('q').defer();
    // we use this thing so that the log messages show up on Digger Log files, not just console.
    // see https://github.com/apache/cordova-lib/blob/f8b58c782c71558516adbbd81929ee31ec3ded7f/cordova-lib/src/hooks/Context.js#L68
    var events = ctx.requireCordovaModule('cordova-common').events;

    var interval;

    var remainingSleepTime = TOTAL;

    var sleepFunction = function () {
        // yeah I know this is not super precise, but not so important!
        remainingSleepTime -= SLEEP_PERIOD;
        console.log("Sleeping for " + SLEEP_PERIOD / 1000 + " seconds. Remaining total sleep time " + remainingSleepTime / 1000 + " seconds...");
        events.emit("verbose", "Sleeping for " + SLEEP_PERIOD / 1000 + " seconds. Remaining total sleep time " + remainingSleepTime / 1000 + " seconds...");
        if (remainingSleepTime <= 0) {
            if (interval) {
                clearInterval(interval);
            }
            deferral.resolve();
        }
    };

    console.log("----------------- RUNNING TIMEOUT CUSTOM HOOK -----------------");
    events.emit('verbose', "----------------- RUNNING TIMEOUT CUSTOM HOOK -----------------");
    sleepFunction();
    interval = setInterval(sleepFunction, SLEEP_PERIOD);

    return deferral.promise;
};