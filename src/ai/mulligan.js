'use strict';
const etg = require('../etg'),
	Cards = require('../Cards');
module.exports = pl =>
	pl.handIds.length < 6 ||
	pl.hand.some(
		({ card }) =>
			card.type === etg.Pillar ||
			card.isOf(Cards.Nova) ||
			card.isOf(Cards.Immolation) ||
			card.isOf(Cards.GiftofOceanus) ||
			card.isOf(Cards.QuantumLocket),
	) ||
	pl.deck.every(({ card }) => card.type != etg.Pillar);
