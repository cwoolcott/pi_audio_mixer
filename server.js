const inquirer = require('inquirer');
const portAudio = require('naudiodon');
const fs = require('fs');
const cp = require("child_process");

function audioTest(option) {
  console.log(option)
  if (option === 'Volume') {
    //amixer set 'ADC1' 50%
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'channel',
          message: 'Choose a Channel:',
          choices: ['ADC1', 'ADC2', 'ADC1', 'DAC1', 'DAC2', 'DAC3', 'DAC4'],
        },
      ])
      .then(res => {

        let _channel = res.channel;
        inquirer
          .prompt([
            {
              name: 'volume',
              message: 'Volume %?'
            },
          ])
          .then(res => {
            let _volume = res.volume
            soundCards = cp.execSync("amixer set " + _channel + " + " + _volume + "%");
            console.log(soundCards)
          });
      });

    menu();
  }

}

function menu() {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'TESTING:',
        choices: ['Volume', 'Exit'],
      },
    ])
    .then(answers => {
      audioTest(answers.option);
    });
}

menu();