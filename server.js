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
          name: 'channelCount',
          message: 'Channel Count (#)'
        },
      ])
      .then(answers => {
        var ao = new portAudio.AudioIO({
          outOptions: {
            channelCount: answers.channelCount,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: 48000,
            deviceId: 0, // Use -1 or omit the deviceId to select the default device
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
}

function menu() {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'TESTING:',
        choices: ['Get Audio Device', 'Play Audio', 'Exit'],
      },
    ])
    .then(answers => {
      audioTest(answers.option);
    });
}

menu();