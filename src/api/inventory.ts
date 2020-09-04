import { Message, RichEmbed, User } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

const { Pool } = require('pg');

const inventory = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

  pool.query(
    `select count(card), title, rarity from (select card,player,title,description,active,rarity from stash inner join card on stash.card=card.id where player='${msg.author.id}' and active=true) as playerStash group by playerStash.rarity, playerStash.card, playerStash.title order by playerStash.rarity,playerStash.title`,
    (err: any, res: any) => {
      if (!err) {
        const stash: { count: number; title: string; rarity: number }[] = res.rows;

        const rarityArray = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

        let inventory = stash
          .map((el,index) => {
            let text = ``;
            if(index == 0 || el.rarity>stash[index-1].rarity) {
              text += `\n**${rarityArray[el.rarity]}**\n`;
            }
            text += `${el.count} × ${el.title}`
            return text;
          })
          .join('\n');

        if (stash.length > 0) {
          const embed = new RichEmbed()
            .setColor('#b2ebf2')
            .setDescription(`Инвентарь пользователя <@${msg.author.id}>\n${inventory}`)
            .setThumbnail('https://cdn4.iconfinder.com/data/icons/magic-flat/64/Card-256.png')

          msg.channel.sendEmbed(embed);
        } else {
          const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`Инвентарь пользователя <@${msg.author.id}> пуст`);

          msg.channel.sendEmbed(embed);
        }
      }
      pool.end();
    },
  );
};

export default inventory;
