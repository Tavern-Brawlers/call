import { Message, RichEmbed, MessageAttachment } from 'discord.js';
import axios from 'axios';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { rarityMapNumberHex } from '../services/deck.service';

const fs = require('fs');

const { Pool } = require('pg');

export interface Character {
  profile: {
    name: string;
  };
  total_points: number;
  modified_date: string;
}

const update = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const response = await axios.get(msg.attachments.array()[0].url);

  const sheet = response.data as Character;

  const pool = new Pool();

  pool.query(`UPDATE character SET sheet=$DEDUHAN$${JSON.stringify(sheet)}$DEDUHAN$ WHERE character.uid='${args}'`).then(() => {
    const embed = new RichEmbed().setColor(`#`).setDescription(`Обновлен персонаж **${sheet.profile.name}**`);
    msg.channel.sendEmbed(embed);
  });
};

export default update;
