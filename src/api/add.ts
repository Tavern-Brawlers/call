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

const add = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const code = cmd.arguments.join('');

  const response = await axios.get(msg.attachments.array()[0].url);

  const sheet = response.data as Character;

  const pool = new Pool();

  if (sheet) {
    pool
      .query(
        `INSERT INTO character (sheet, discord, name) VALUES ($DEDUHAN$${JSON.stringify(sheet)}$DEDUHAN$, '${msg.author.id}', '${sheet.profile.name}')`,
      )
      .then(() => {
        const embed = new RichEmbed().setColor(`#`).setDescription(`Создан персонаж **${sheet.profile.name}**`);
        msg.channel.sendEmbed(embed);
      });
  } else {
    const embed = new RichEmbed().setColor('#E64A19').setDescription(`Прикрепи лист персонажа в формате **.gcs**.`);

    msg.channel.sendEmbed(embed);
  }
};

export default add;
