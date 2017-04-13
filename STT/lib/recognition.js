var http = require('http');
var cloud = require('google-cloud');

var config = {
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: '/Users/chrisholden/Development/My First Project-15fbe0027cfd.json'
};

var speech = cloud.speech(config);

function recogniseFile(fileName, callback) {
    console.log('processing: ' + fileName);
    speech.recognize(fileName, {
        encoding: 'FLAC',
        sampleRateHertz: 16000,
        languageCode: 'en-GB',
        maxAlternatives: 3

    }, function(err, transcript) {
        callback(err, transcript);
    });
}

/*
 for(var i in dataBlocks) {
 if(dataBlocks.hasOwnProperty(i)) {
 req.write(new Buffer(dataBlocks[i],'binary'));
 }
*/

module.exports.recogniseFile = recogniseFile;
