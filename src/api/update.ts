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
  const code = cmd.arguments.join('');

  const response = await axios.get(msg.attachments.array()[0].url);

  const sheet = response.data as Character;

  const pool = new Pool();

  if (code) {
    pool.query(`SELECT * FROM character WHERE character.uid='${code}'`, (err: any, res: any) => {
      if (!err) {
        const characters: { sheet: Character , discord: string}[] = res.rows;

        if (characters.length > 0) {
          const character = characters[0];

          if( character.discord === `${msg.author.id}`){
            pool
            .query(`UPDATE character SET sheet=$DEDUHAN$${JSON.stringify(sheet)}$DEDUHAN$ WHERE character.uid='${code}'`)
            .then(() => {
              const embed = new RichEmbed().setColor(`#`).setDescription(`Обновлен персонаж **${sheet.profile.name}**`);
              msg.channel.sendEmbed(embed);
            });
          } else {
            const embed = new RichEmbed().setColor('#E64A19').setDescription(`Ты не владеешь этим персонажем.`);

            msg.channel.sendEmbed(embed);
          }
        } else {
          const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`Персонажа с кодом **${code}** не существует.`);

          msg.channel.sendEmbed(embed);
        }
      } else {
        msg.channel.send(err);
      }
    });
  } else {
    const embed = new RichEmbed().setColor('#E64A19').setDescription(`Укажи код персонажа.`);

    msg.channel.sendEmbed(embed);
  }
};

export default update;
