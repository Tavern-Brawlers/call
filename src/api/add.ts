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
  const code = cmd.arguments.join(' ');

  const pool = new Pool();

  if (code.replace(/\s/g, '')) {
    pool.query(`SELECT name,uid FROM campaign WHERE name='${code}'`, async (err: any, res: any) => {
      if (!err) {
        const campaigns: { name: string; uid: string }[] = res.rows;

        if (campaigns.length > 0) {
          const campaign = campaigns[0];
          if (msg.attachments.array()[0].url) {
            const response = await axios.get(msg.attachments.array()[0].url);

            const sheet = response.data as Character;
            if (sheet) {
              pool
                .query(
                  `INSERT INTO character (sheet, discord, name, campaign) VALUES ($DEDUHAN$${JSON.stringify(
                    sheet,
                  )}$DEDUHAN$, '${msg.author.id}', '${sheet.profile.name}', '${campaign.uid}')`,
                )
                .then(() => {
                  const embed = new RichEmbed()
                    .setColor(`#9CCC65`)
                    .setDescription(`Добавлен новый персонаж **${sheet.profile.name}** в кампанию **${campaign.name}**`);
                  msg.channel.sendEmbed(embed);
                });
            } else {
              const embed = new RichEmbed()
                .setColor('#E64A19')
                .setDescription(`Прикрепи лист персонажа в формате **.gcs**.`);

              msg.channel.sendEmbed(embed);
            }
          } else {
            const embed = new RichEmbed()
              .setColor('#E64A19')
              .setDescription(`Прикрепи лист персонажа в формате **.gcs**.`);

            msg.channel.sendEmbed(embed);
          }
        } else {
          const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`Кампании с именем **${code}** не существует.`);

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
              return `${el.name}`;
            })
            .join('\n');

          const embed = new RichEmbed()
            .setColor(`#00796B`)
            .setDescription(`Укажи название кампании, в которую хочешь добавить персонажа:\n${list}`);

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

export default add;
