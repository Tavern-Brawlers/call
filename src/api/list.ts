import { Message, RichEmbed, MessageAttachment } from 'discord.js';
import axios from 'axios';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { rarityMapNumberHex } from '../services/deck.service';

import { Character } from './update';

const fs = require('fs');

const { Pool } = require('pg');

const list = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const code = cmd.arguments.join(' ');

  const pool = new Pool();

  pool.query(`SELECT * FROM character WHERE character.discord='${msg.author.id}'`, (err: any, res: any) => {
    if (!err) {
      const characters: { sheet: Character; uid: string , campaign: string}[] = res.rows;

      if (characters.length > 0) {
        let list = characters
          .map((el, index) => {
            return `- - -
            **${el.sheet?.profile?.name ? el.sheet.profile.name : 'имя персонажа не указано'}**
            Код персонажа: ${el.uid}
            Код кампании: ${el.campaign}`;
          })
          .join('\n');

        const embed = new RichEmbed()
          .setColor(`#00796B`)
          .setDescription(`**Список персонажей** <@${msg.author.id}>\n${list}`);

        msg.channel.sendEmbed(embed);
      } else {
        const embed = new RichEmbed().setColor('#E64A19').setDescription(`У вас нет персонажей.`);

        msg.channel.sendEmbed(embed);
      }
    } else {
      msg.channel.send(err);
    }
  });
};

export default list;
