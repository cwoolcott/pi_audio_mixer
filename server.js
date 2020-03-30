const inquirer = require('inquirer');
const portAudio = require('naudiodon');
const fs = require('fs');
const cp = require("child_process");

function audioTest(option) {
  console.log(option)
  if (option === 'Get Audio Device') {
    console.log(portAudio.getDevices());
    menu();
  }
  else if (option === 'Load Sound Card') {
    let hwInfo = Object.create(null);

    let soundCards = cp.execSync("arecord -L | grep :CARD")
      .toString('utf8').trim().split("\n");
    hwInfo["soundCards"] = soundCards;
    console.table(hwInfo);
  }
  else if (option === '50% Volume') {
    inquirer
      .prompt([
        {
          name: 'channelName',
          message: 'change Name?'
        },
      ])
      .then(answers => {
        let soundCards = cp.execSync("amixer set " + channelName + " + 50%");
        console.table(soundCards);
      })

  }
  else if (option === '50% Volume') {
    inquirer
      .prompt([
        {
          name: 'channelName',
          message: 'change Name?'
        },
      ])
      .then(answers => {
        let soundCards = cp.execSync("amixer set " + channelName + " + 100%");
        console.table(soundCards);
      })

  }
  else if (option === 'scontents') {
    let soundCards = cp.execSync("amixer scontents");
    console.table(soundCards);
  }



  else if (option === "Sound Player") {
    // With full options
    var soundplayer = require("sound-player");
    var options = {
      filename: "./samples/cantina.wav",
      gain: 100,
      debug: true,
      player: "aplay", // "afplay" "aplay" "mpg123" "mpg321"
      device: "sysdefault:CARD=audioinjectoroc"   //
    }

    var player = new soundplayer(options)
    player.play();

    player.on('complete', function () {
      console.log('Done with playback!');
    });

    player.on('error', function (err) {
      console.log('Error occurred:', err);
    });
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

        var rs = fs.createReadStream('./samples/cantina.wav');
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
  else if (option === 'Get Host') {
    console.log(portAudio.getHostAPIs());
  }
  else if (option === 'Audio Mixer') {
    var AudioMixer = require('audio-mixer');

    // Creates a new audio mixer with the specified options
    let mixer = new AudioMixer.Mixer({
      channels: 2,
      bitDepth: 16,
      sampleRate: 44100,
      clearInterval: 250
    });

    // Creates an input that is attached to the mixer
    let input = mixer.input({
      channels: 1,
      volume: 75
    });

    // Creates a standalone input
    let standaloneInput = new AudioMixer.Input({
      channels: 1,
      bitDepth: 16,
      sampleRate: 48000,
      volume: 75
    });

    // Adds the standalone input to the mixer
    mixer.addInput(standaloneInput);

    // Pipes a readable stream into an input
    deviceInputStream.pipe(input);
    deviceInputStream2.pipe(standaloneInput);

    // Pipes the mixer output to an writable stream
    mixer.pipe(deviceOutputStream);
  }
}

function menu() {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'TESTING:',
        choices: ['50% Volume', '100% Volume', 'Exit'],
      },
    ])
    .then(answers => {
      audioTest(answers.option);
    });
}

menu();