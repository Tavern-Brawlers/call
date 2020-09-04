import readline from 'readline';
import minimist from 'minimist';
import chalk from 'chalk';

import BotCommandMap from './BotCommandMap';

class BotConsoleReader {
  public commands: BotCommandMap;

  public constructor() {
    this.commands = new BotCommandMap();
  }

  public listen(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', (input): void => {
      if (!input) return;

      const parts = input.split(' ');
      const result = minimist(parts);

      const cmds = this.commands.get(result._[0]);

      if (cmds) {
        cmds.forEach((cmd): void => cmd(result, rl));
      }
    });

    rl.on('close', (): void => {
      chalk.yellow('Console Reader Disconnected');
    });
  }
}

export default BotConsoleReader;
