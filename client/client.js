const io = require('socket.io-client');
const readline = require('readline');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

class Client {
  constructor() {
    this.chat = io.connect(argv.server);
    this.user = 'Anonymous';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.chat.on('connect', () => this.init())
    this.chat.on('chat message', (msg) => {
      if(msg.split(": ").length > 1) {
        let sp = msg.split(": "),
          user = sp[0],
          text = sp[1]
        console.log(`${chalk.bgWhite(chalk.bold(chalk.gray(` ${user} `)))}: ${chalk.blue(text)}`);
      } else {
        console.log(`${chalk.bgYellow(chalk.bold(chalk.gray(` ${msg} `)))}`)
      }
      this.message();
    })
  }

  init() {
    this.setUser((user) => {
      user ? user : this.user;
      this.chat.emit('chat message', `${user} joined.`)
      this.rl.clearLine();
      process.stdout.cursorTo(0)
    });
  }

  setUser(callback) {
    if(argv.username) {
      this.user = argv.username
      callback();
      this.message();
    } else {
      this.rl.question('username?  ', (username) => {
        this.user = username;
        callback(username);
        this.message();
      });
    }
  }

  message() {
    this.rl.question('>> ', (answer) => {
      this.chat.emit('chat message', `${this.user}: ${answer}`);
    });
  }
}

new Client();