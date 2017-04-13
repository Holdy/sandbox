var recorder = require('./lib/soundRecorder');
var recognition = require('./lib/recognition');
var fs = require('fs');

function waitForInput() {
    var dataBlocks = [];
    var totalSamples = 0;

    console.log('Listening:');
    recorder.waitAndRecordSound(
        function onStart() {
            console.log('started...');
        },
        function onData(data) {
            dataBlocks.push(data);
            totalSamples += data.length;
            console.log('got data...');
        },
        function onStop(err) {
            console.log('stop. (samples: ' + totalSamples + ')' + (err ? ' err:' + err:''));
            if (!err) {
                processAudio(dataBlocks);
            }
        }
    );
}

var fileIndex = 0;
var tempFileName; // = '/Users/chrisholden/Development/sandbox/STT/sound.flac';

function newFile() {
     tempFileName = '/Users/chrisholden/Development/sandbox/STT/sound.flac';
}

function processAudio(dataBlocks) {
    newFile();
    var file = fs.createWriteStream(tempFileName, {flags:'w'});
    file.on('error', function(err) {
        console.log(err);
    });

    for(var i in dataBlocks) {
        if(dataBlocks.hasOwnProperty(i)) {
            file.write(new Buffer(dataBlocks[i],'binary'));
        }
    }
    file.end();

    recognition.recogniseFile(tempFileName, processRecognitionResult);
}


function processRecognitionResult(err, result) {
    if (err) {
        console.log('ERROR: ' + err);

    } else {
        console.log('transcript: ' + result + '\n');
    }
    waitForInput();
}

waitForInput();
