import { Message, RichEmbed, MessageAttachment } from 'discord.js';
import axios from 'axios';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { rarityMapNumberHex } from '../services/deck.service';

import { Character } from './update';

const fs = require('fs');

const { Pool } = require('pg');

const get = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const code = cmd.arguments.join(' ');

  const pool = new Pool();

    if(code){
      pool.query(`SELECT * FROM character WHERE character.uid='${code}'`, (err: any, res: any) => {
        if(!err){
        const characters: {sheet: Character}[] = res.rows;

        if(characters.length > 0){
          const character = characters[0];

          const embed = new RichEmbed()
          .setColor(`#00796B`)
          .setDescription(`${character.sheet.profile.name}\n${character.sheet.total_points}\n${character.sheet.modified_date}`)

          msg.channel.sendFile(Buffer.from(JSON.stringify(character.sheet), 'utf8'), `${character.sheet.profile.name}.gcs`)

        } else {
          const embed = new RichEmbed()
          .setColor('#E64A19')
          .setDescription(`Персонажа с кодом **${code}** не существует.`)

          msg.channel.sendEmbed(embed);
        }

        } else {
        msg.channel.send(err);
        }
      });
} else {
  const embed = new RichEmbed()
  .setColor('FFB300')
  .setDescription(`<@${msg.author.id}> укажи код персонажа.`)

  msg.channel.sendEmbed(embed);
}
};

export default get;
