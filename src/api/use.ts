import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { rarityMapNumberHex } from '../services/deck.service';

const { Pool } = require('pg');

const use = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.filter(str => /\S/.test(str)).map(arg => arg.charAt(0).toUpperCase() + arg.slice(1))

  const pool = new Pool();

  if(args.join(' ')){
        pool.query(`select stash.id as stashId, card,player,title,description,active,rarity
        from stash inner join card on stash.card=card.id
        where player='${msg.author.id}' and title='${args.join(' ')}' and active=true`, (err: any, res: any) => {
          if(!err){
          const cards: {stashid: number, card: number, player: number, title: string, description: string, rarity: number}[] = res.rows;

          if(cards.length > 0){
            pool.query(`UPDATE stash SET active=false WHERE stash.id='${cards[0].stashid}'`)
                  .then(() => {
                    const embed = new RichEmbed()
                    .setColor(`${rarityMapNumberHex.get(cards[0].rarity)}`)
                    .setDescription(`<@${msg.author.id}> использует карту **${args.join(' ')}**`)
                    .addField('Описание карты',cards[0].description,false);
                    msg.channel.sendEmbed(embed);
                  })
          } else {
            const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`У <@${msg.author.id}> нет карты **${args.join(' ')}**`)
  
            msg.channel.sendEmbed(embed);
          }

          } else {
          msg.channel.send(err);
          }
        });
  } else {
    const embed = new RichEmbed()
    .setColor('FFB300')
    .setDescription(`<@${msg.author.id}> укажи название карты, которую хочешь применить`)

    msg.channel.sendEmbed(embed);
  }

};

export default use;
