const inquirer = require('inquirer');
const portAudio = require('naudiodon');
const fs = require('fs');

function audioTest(option) {
  console.log(option)
  if (option === 'Get Audio Device') {
    console.log(portAudio.getDevices());
    menu();
  }
  else if (option === 'Play Audio') {

    inquirer
      .prompt([
        {
          name: 'deviceId',
          message: 'device ID? (# -1,)'
        },
      ])
      .then(answers => {

        var deviceId = answers.deviceId ? answers.deviceId : -1;
        var ao = new portAudio.AudioIO({
          outOptions: {
            channelCount: 2,//answers.deviceId,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: 48000,
            deviceId: deviceId, // Use -1 or omit the deviceId to select the default device
            closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
          }
        });

        var rs = fs.createReadStream('samples/cantina.wav');
        // Start piping data and start streaming
        rs.pipe(ao);
        ao.start();
        menu();
      });
  }
  else if (option === 'Audio IO') {
    // Create an instance of AudioIO with inOptions and outOptions, which will return a DuplexStream
    var aio = new portAudio.AudioIO({
      inOptions: {
        channelCount: 2,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 44100,
        deviceId: -1 // Use -1 or omit the deviceId to select the default device
      },
      outOptions: {
        channelCount: 2,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 44100,
        deviceId: -1 // Use -1 or omit the deviceId to select the default device
      }
    });

    aio.start();
  }
}

function menu() {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'TESTING:',
        choices: ['Get Audio Device', 'Play Audio', 'Audio IO', 'Exit'],
      },
    ])
    .then(answers => {
      audioTest(answers.option);
    });
}

menu();