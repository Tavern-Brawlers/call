import { Client } from 'discord.js';

import BotStatus from './BotStatus';
import BotCommandMap from './BotCommandMap';
import { BotConfig } from './BotConfig';

export interface Bot {
  client: Client;
  config: BotConfig;
  status: BotStatus;
  commands: BotCommandMap;
  plugins: BotPlugin[];
  helptext: string;
  online: boolean;
}

export interface BotPlugin {
  preInitialize(bot: Bot): void;
  postInitialize(bot: Bot): void;
}
