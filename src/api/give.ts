import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

const { Pool } = require('pg');

const give = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.filter(str => /\S/.test(str));

  console.log(args);

  
  const pool = new Pool();

  if(/(<@!)([0-9]*)(>)/.test(args[0])){
      const recipient = args[0].slice(3,21);

      
      const card = args.slice(1).join(' ')

      if(recipient !== msg.author.id) {
        if(args[1] && card){
            pool.query(`select stash.id as stashId, card,player,title,description,active
            from stash inner join card on stash.card=card.id
            where player='${msg.author.id}' and title='${card}' and active=true`, (err: any, res: any) => {
              if(!err){
              const cards: {stashid: number, card: number, player: number, title: string, description: string}[] = res.rows;
    
              if(cards.length > 0){
                pool.query(`UPDATE stash SET player=${recipient} WHERE stash.id='${cards[0].stashid}'`)
                      .then(() => {
                        const embed = new RichEmbed()
                        .setColor('#F50057')
                        .setDescription(`<@${msg.author.id}> передаёт карту **${card}** игроку <@${recipient}>.`)
                        .addField('Описание карты',cards[0].description,false);
                        msg.channel.sendEmbed(embed);
                      })
              } else {
                const embed = new RichEmbed()
                .setColor('#E64A19')
                .setDescription(`У <@${msg.author.id}> нет карты **${card}**.`)
      
                msg.channel.sendEmbed(embed);
              }
    
              } else {
              msg.channel.send(err);
              }
            });
      } else {
        const embed = new RichEmbed()
        .setColor('FFB300')
        .setDescription(`<@${msg.author.id}> укажи название карты, которую хочешь применить.`)
    
        msg.channel.sendEmbed(embed);
      }
      } else {
        const embed = new RichEmbed()
        .setColor('FFB300')
        .setDescription(`<@${msg.author.id}> ты не можешь прередать карту самому себе.`)
    
        msg.channel.sendEmbed(embed);
      }
  }
};

export default give;
