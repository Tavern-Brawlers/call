import DefaultBotConfig from './core/BotConfig';
import { Pool } from 'pg';
import YBot from './core/Bot';
import chalk from 'chalk';


const bot = new YBot(DefaultBotConfig);

bot
  .connect()
  .then((): void => {
    chalk.black('Bot Ready')
  })
  .catch((err: Error): void => {
    chalk.red(err)
  });
