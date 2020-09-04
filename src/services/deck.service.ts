/* eslint-disable max-len */
export interface Card {
  name: string;
  description: string;
  rarity: string;
}

export const rarityMapDec = new Map<string, number>([
  ['common', 16777215],
  ['uncommon', 2031360],
  ['rare', 28893],
  ['epic', 10696174],
  ['legendary', 16744448],
]);

export const rarityMapHex = new Map<string, string>([
  ['common', '#dcdde1'],
  ['uncommon', '#44bd32'],
  ['rare', '#0097e6'],
  ['epic', '#a55eea'],
  ['legendary', '#fd9644'],
]);

export const rarityMapNumberHex = new Map<number, string>([
  [0, '#dcdde1'],
  [1, '#44bd32'],
  [2, '#0097e6'],
  [3, '#a55eea'],
  [4, '#fd9644'],
]);

export const rarityArray = [16777215, 2031360, 28893, 10696174, 16744448];

const commonCards: Card[] = [
  {
    name: 'Vitality',
    rarity: 'common',
    description: 'Примени, чтобы восстановить 2 HP.',
  },
  {
    name: 'Endurance',
    rarity: 'common',
    description: 'Примени, чтобы восстановить 2 FP.',
  },
  {
    name: 'Collaboration',
    rarity: 'common',
    description: 'Примени, чтобы получить +1 к броску помощи сопартийцу.',
  },
  {
    name: 'Communication',
    rarity: 'common',
    description: 'Примени, чтобы получить +2 к Influence Roll (Basic Set p.359).',
  },
];

const uncommonCards: Card[] = [
  {
    name: 'Gizmo',
    rarity: 'uncommon',
    description: 'Примени, чтобы получить одноразовое преимущество Gizmos (Basic Set p.57).',
  },
  {
    name: 'Imp',
    rarity: 'uncommon',
    description: 'Примени перед входом в подземелье, чтобы сделать его немного сложнее и богаче.',
  },
  {
    name: 'Rising Sun',
    rarity: 'uncommon',
    description: 'Примени, чтобы получить 1d3 поинтов.',
  },
  {
    name: 'Venture',
    rarity: 'uncommon',
    description: 'Примени перед броском, чтобы изменить рамки критпровала (16-18) и критуспехая (3-6).',
  },
];

const rareCards: Card[] = [
  {
    name: 'Sagacity',
    rarity: 'rare',
    description: 'Примени, когда хочешь успеть куда-то вовремя (убежать от взыва, ворваться в бой и т.д.).',
  },
  {
    name: 'Compass',
    rarity: 'rare',
    description: 'Примени, чтобы узнать направление до желаемого.',
  },
  {
    name: 'Devil',
    rarity: 'rare',
    description: 'Примени перед входом в подземелье, чтобы сделать его сложнее и богаче.',
  },
  {
    name: 'Dare',
    rarity: 'rare',
    description: 'Примени перед броском, чтобы изменить рамки критпровала (14-18) и критуспехая (3-8).',
  },
  {
    name: 'Lesser Soul Vessel',
    rarity: 'rare',
    description: 'Примени, чтобы перераспределить 15 поинтов.',
  },
  {
    name: 'Sun',
    rarity: 'rare',
    description: 'Примени, чтобы дать всей группе 1d3 поинтов.',
  },
  {
    name: 'Knowledge',
    rarity: 'rare',
    description: 'Примени, чтобы определить магический предмет (Считай это автоматическим успехом Analyze Magic).',
  },
];

const epicCards: Card[] = [
  {
    name: 'Chance',
    rarity: 'epic',
    description:
      'Примени карту после броска кубов. Ты можешь перебросить один кубик дважды и выбрать лучший из трёх результатов.',
  },
  {
    name: 'Hospital',
    rarity: 'epic',
    description: 'Примени, чтобы восстановить 3 HP всей группе.',
  },
  {
    name: 'Soul Vessel',
    rarity: 'epic',
    description: 'Примени,чтобы перераспределить 30 поинтов.',
  },
  {
    name: 'Oni',
    rarity: 'epic',
    description: 'Примени перед входом в подземелье, чтобы сделать его намного сложнее и богаче.',
  },
  {
    name: 'Daredevil',
    rarity: 'epic',
    description: 'Примени перед броском, чтобы изменить рамки критпровала (12-18) и критуспехая (3-10).',
  },
  {
    name: 'Sun Zenith',
    rarity: 'epic',
    description: 'Примени, чтобы получить 1d6 поинтов. Дай группе в два раза меньше поинтов.',
  },
];

const legendaryCards: Card[] = [
  {
    name: 'Prophecy',
    rarity: 'legendary',
    description:
      'Примени, чтобы забытый бог выбрал вас своим паладином в этом бою. Получите эффект Heroic Feats 3. Вы можете начать выкупать линзу (Holy Warrior, Unholy Warrior, Cleric, Evil Cleric) или дополнительный пантеон, если вы уже имеете один из перечисленных классов.',
  },
  {
    name: 'Mortal Resolve',
    rarity: 'legendary',
    description:
      'Примени, чтобы получить разовое использование правила Flesh Wound (Basic Set p.417)',
  },
];

const pickRandomCard = (): Card => {
  const random = Math.random();

  if (random < 0.01) {
    return legendaryCards[Math.floor(Math.random() * legendaryCards.length)];
  }
  if (random < 0.09) {
    return epicCards[Math.floor(Math.random() * epicCards.length)];
  }
  if (random < 0.15) {
    return rareCards[Math.floor(Math.random() * rareCards.length)];
  }
  if (random < 0.25) {
    return uncommonCards[Math.floor(Math.random() * uncommonCards.length)];
  }

  return commonCards[Math.floor(Math.random() * commonCards.length)];
};


export default pickRandomCard;
