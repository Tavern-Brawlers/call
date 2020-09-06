import { Client, Message } from 'discord.js';
import { ParsedArgs } from 'minimist';
import { Interface } from 'readline';

import { Bot, BotPlugin } from './BotInterface';
import { BotConfig } from './BotConfig';
import BotStatus from './BotStatus';
import BotConsoleReader from './BotConsoleReader';
import BotCommandMap from './BotCommandMap';
import { ParsedMessage, parse } from './BotCommandParser';

import get from '../api/get';
import add from '../api/add';
import update from '../api/update';
import info from '../api/info';
import list from '../api/list';
import campaign from '../api/campaign';

class YBot implements Bot {
  public client: Client;

  public config: BotConfig;

  public status: BotStatus;

  public commands: BotCommandMap;

  public console: BotConsoleReader;

  public online: boolean;

  public helptext: string;

  public plugins: BotPlugin[];

  public constructor(config: BotConfig) {
    this.helptext = 'Help hint!';

    this.online = false;
    this.config = config;

    this.commands = new BotCommandMap()
      // .on('draw', draw)
      // .on('update', update)
      .on('get', get)
      .on('update', update)
      .on('list', list)
      .on('add', add)
      .on('campaign', campaign)
      .on('info', info);

    this.client = new Client()
      .on('message', (msg: Message): void => {
        if (msg.isMemberMentioned(this.client.user)) {
          const parsed: ParsedMessage<Message> = parse(msg, undefined);
          if (!parsed.success) return;

          const handlers = this.commands.get(parsed.command);

          if (handlers) {
            handlers.forEach((handle): void => {
              handle(parsed, msg, this);
            });
          }
        }
      })
      .on('ready', (): void => {
        this.online = true;

        this.status.setActivity('online');
        this.status.setBanner('создание персонажей');
      })
      .on('reconnecting', (): void => {})
      .on('disconnect', (): void => {
        this.online = false;
      })
      .on('error', (error: Error): void => {})
      .on('guildMemberUpdate', (): void => {})
      .on('guildMemberSpeaking', (): void => {});

    this.console = new BotConsoleReader();

    this.console.commands.on('exit', (args: ParsedArgs, rl: Interface): void => {
      if (this.client) this.client.destroy();

      rl.close();

      process.exit(0);
    });

    this.status = new BotStatus(this.client);

    this.plugins = [];

    this.plugins.forEach((plugin): void => {
      plugin.preInitialize(this);
      plugin.postInitialize(this);
    });
  }

  public connect(): Promise<string> {
    return this.client.login(this.config.discord.token);
  }
}

export default YBot;
