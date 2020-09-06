import { Message, RichEmbed, MessageAttachment } from 'discord.js';
import axios from 'axios';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { rarityMapNumberHex } from '../services/deck.service';

import { Character } from './update';

const fs = require('fs');

const { Pool } = require('pg');

const campaign = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const code = cmd.arguments.join(' ');

  const pool = new Pool();

  if (code) {
    pool.query(`SELECT name FROM campaign WHERE uid='${code}'`, (err: any, res: any) => {
      if (!err) {
        const campaigns: { name: string; uid: string; campaign: string }[] = res.rows;

        if (campaigns.length > 0) {
          const campaign = campaigns[0];
          pool.query(`SELECT * FROM character WHERE character.campaign='${code}'`, (err: any, res: any) => {
            if (!err) {
              const characters: { sheet: Character; uid: string; campaign: string }[] = res.rows;

              if (characters.length > 0) {
                const character = characters[0];

                let list = characters
                  .map((el, index) => {
                    return `- - -
                      **${el.sheet?.profile?.name ? el.sheet.profile.name : 'имя персонажа не указано'}**
                      Код персонажа: ${el.uid}`;
                  })
                  .join('\n');

                const embed = new RichEmbed()
                  .setColor(`#00796B`)
                  .setDescription(`Кампания **${campaign.name}**\n${list}`);

                msg.channel.sendEmbed(embed);
              } else {
                const embed = new RichEmbed()
                  .setColor('#E64A19')
                  .setDescription(`В кампании **${campaign.name}** нет персонажей.`);

                msg.channel.sendEmbed(embed);
              }
            } else {
              msg.channel.send(err);
            }
          });
        } else {
          const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`Кампании с кодом **${code}** не существует.`);

          msg.channel.sendEmbed(embed);
        }
      } else {
        msg.channel.send(err);
      }
    });
  } else {
    pool.query(`SELECT * FROM campaign`, (err: any, res: any) => {
      if (!err) {
        const campaigns: { name: string; uid: string }[] = res.rows;

        if (campaigns.length > 0) {
          let list = campaigns
            .map((el, index) => {
              return `**${el.name}** ${el.uid}`;
            })
            .join('\n');

          const embed = new RichEmbed().setColor(`#00796B`).setDescription(`Кампании:\n${list}`);

          msg.channel.sendEmbed(embed);
        } else {
          const embed = new RichEmbed().setColor('#E64A19').setDescription(`Ошибка в таблице **campaign**.`);

          msg.channel.sendEmbed(embed);
        }
      } else {
        msg.channel.send(err);
      }
    });
  }
};

export default campaign;
