var recorder = require('./lib/soundRecorder');


recorder.waitAndRecordSound(
    function onStart() {
        console.log('started...');
    },
    function onData(data) {
        console.log('got data...');
    },
    function onStop(err) {
        console.log('stop. err:' + err);
    }
);
