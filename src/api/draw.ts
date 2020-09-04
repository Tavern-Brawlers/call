import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { rarityMapNumberHex } from '../services/deck.service';

const { Pool } = require('pg');

const draw = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

  let rarity = 0;

  const probs = [0.1, 0.4, 0.25, 0.15, 0.1];

  const rand = Math.random();

  let sum = 0;

  for (let i = 0; i < probs.length; i++) {
    sum += probs[i];
    if (rand < sum) {
      rarity = i;
      break;
    }
  }

  pool
    .query(`select * from card where rarity='${rarity}' and drops=true`)
    .then((res: { rows: { id: number; user: string; weight: number; title: string; description: string }[] }) => {
      const stash = res.rows;

      const n = stash.map(card => card.weight).reduce((a, b) => a + b, 0);

      stash.forEach(card => (card.weight = card.weight / n));

      stash.sort(() => 0.3 - Math.random());

      let sum = 0;

      let randomCard: { id: number; user: string; weight: number; title: string; description: string } = stash[0];

      for (let i = 0; i < stash.length; i++) {
        sum += stash[i].weight;
        if (rand < sum) {
          randomCard = stash[i];
          break;
        }
      }

      pool.query(`insert into stash (card, player) values ('${randomCard.id}', '${msg.author.id}');`).then(() => {
        const embed = new RichEmbed()
          .setColor(rarityMapNumberHex.get(rarity)!)
          .setDescription(`<@${msg.author.id}> вытянул карту **${randomCard.title}**`)
          .addField('Описание карты', randomCard.description, false);
        msg.channel.sendEmbed(embed);
      });
    });
};

export default draw;
