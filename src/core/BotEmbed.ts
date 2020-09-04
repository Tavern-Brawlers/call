/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/prefer-default-export */
import { RichEmbed, User } from 'discord.js';

import { Card, rarityMapHex } from '../services/deck.service';


export const cardDrawn = (user: User, card: Card): RichEmbed => {
  const embed = new RichEmbed()
    .setColor(rarityMapHex.get(card.rarity)!)
    .setDescription(`<@${user.id}> вытянул карту **${card.name}**`)
    .setFooter(card.description);
    // .setThumbnail(`http://${track.albums[0].coverUri.slice(0, -2)}200x200`)
    // .addField('Track', `${track.name}`, true)
    // .addField('Artist', track.artists[0] ? `${track.artists[0].name}` : 'none', true)
    // .addField('Album', `${track.albums[0].title}`, true)

  return embed;
};
