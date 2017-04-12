var spawn = require('child_process').spawn;

var binCommand = __dirname + '/sox'; // need to: brew install sox --with--flac
var silenceThreshold = '0.1';

var binArgs = [
    '-q',         // No progress.
    '-d',         // Default device
    '-c','1',     // One channel
    '-b','16',    // 16 bits
    '-r','16000', // rate
    '-t','flac',  // data encoding
    '-',          // Pipe data
    'silence','1','0.1',(silenceThreshold || '0.1')+'%','1','0.5',(silenceThreshold || '0.1')+'%'
];

function waitAndRecordSound(startCallback, dataCallback, stopCallback) {

    var recRunning = false;
    var rec = spawn(binCommand, binArgs, { stdin:'pipe' });

    rec.on('error', function(data) {
        stopCallback('Rec process failed to start - is sox missing?');
    });

    var seenInitialData = false;

    rec.stdout.on('readable', function() {
        if (!seenInitialData) {
            seenInitialData = true;
            startCallback();
        }
    });

    rec.stdout.setEncoding('binary');
    rec.stdout.on('data', function(data) {
        dataCallback(data);
    });


    rec.stderr.setEncoding('utf8');
    rec.stderr.on('data', function(data) {
        console.log(data)
    });

    rec.on('close', function(code) {
        if (code) {
            stopCallback('sox exited with code' + code);
        } else {
            stopCallback();
        }
    });

}





module.exports.waitAndRecordSound = waitAndRecordSound;
