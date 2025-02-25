import * as etg from './etg.js';
import Card from './Card.js';
import Thing from './Thing.js';
import { Names } from './Cards.js';

export default function skillText(c) {
	if (c instanceof Card && c.type === etg.Spell) {
		const entry = getDataFromName(c.active.get('cast').castName);
		return processEntry(c, 'cast', entry);
	} else {
		const ret = [],
			stext = [];
		for (const [key, val] of c.status) {
			if (!val) continue;
			const entry = statusData[key];
			if (entry === undefined) {
				let text = val === 1 ? key : val + key;
				text = text.charAt(0).toUpperCase() + text.slice(1);
				stext.push(text);
			} else pushEntry(ret, c, '', entry);
		}
		if (stext.length) ret.unshift(stext.join(', ') + '.');
		for (const [k, v] of c.active) {
			v.name.forEach(name => {
				const entry = getDataFromName(name);
				if (entry === undefined) return;
				pushEntry(ret, c, k, entry);
				if (k === 'cast')
					ret[ret.length - 1] = `${c.cast}:${c.castele} ${ret[ret.length - 1]}`;
			});
		}
		return ret.join('\n');
	}
}

const data = {
	abomination: 'Amiable to mutation',
	absorber: 'Produce 3:6 per attacker',
	acceleration: c =>
		`Replaces target creature\'s skills with "Gain +${
			c.upped ? 3 : 2
		}|-1 per turn"`,
	accretion:
		"Destroy target permanent & gain 0|10. Return to owner's hand as a Blackhole if HP exceeds 30",
	accumulation: 'Increment damage reduction per stack',
	adrenaline:
		'Target creature attacks multiple times per turn. Weaker creatures gain more attacks',
	aether: 'Produce 1:12 on death',
	aflatoxin:
		'Apply 2 poison to target. When target dies, it becomes a Malignant Cell',
	aggroskele: 'Summon a Skeleton. All own skeletons attack target creature',
	air: 'Produce 1:9 per turn',
	alphawolf: 'Summon two 2|1 Pack Wolves on play',
	antimatter: 'Invert strength of target',
	appease: 'Sacifice own creature & gain 1|1. If not, retaliate',
	atk2hp: "Target's health is changed to match its strength",
	autoburrow: 'Until end of turn, creatures with burrow enter play burrowed',
	axedraw: 'Increment damage per draw. Reset on attack',
	bblood: 'Target creature gains 0|20 & is delayed 5 turns',
	becomearctic: 'Become Arctic if frozen',
	beguile: 'Steal target creature until next turn',
	beguilestop: 'Return to original owner at start of next turn',
	bellweb: 'Target creature becomes aquatic & loses airborne',
	blackhole:
		'Absorb 3 quanta per element from target player. Heal 1 per absorbed quantum',
	bless: 'Target gains 3|3',
	blockwithcharge: 'Block attack per stack',
	bolsterintodeck:
		'Push 3 copies of target creature onto own deck. Cannot ricochet',
	boneyard: c =>
		`When a death occurs, summon a ${c.upped ? '2|2' : '1|1'} Skeleton`,
	bounce: "Return to owner's hand instead of dying",
	bravery: 'Foe draws twice, draw an equal amount',
	brawl:
		'Own creatures attack. If a creature exists in opposing slot, they duel instead. Consumes remaining 1:3',
	brew: 'Generate a random Alchemy card',
	brokenmirror: [
		'When foe plays a creature from hand, summon a 1|1 Phantom',
		'When foe plays a creature from hand, summon a 2|1 Phantom',
	],
	butterfly:
		'Target with strength less than 3, or HP less than 3, has skills replaced with "3:1 Destroy target permanent"',
	burrow: 'Burrow. Burrowed creatures attack with half strength',
	catapult:
		'Sacrifice target creature to damage foe 100HP/(100+HP). Frozen targets deal 1.5x more. Poisoned creatures transfer poison',
	catlife: 'On death, exchange a life to revive with 1 HP',
	cell: 'Become Malignant if poisoned',
	chaos: c =>
		(c.upped ? '20% chance to evade. ' : '') +
		'Non-ranged attacking creatures have a 30% chance to have a random effect cast on them',
	chimera:
		'Combine all own creatures to form a Chimera with momentum & gravity pull',
	chromastat: 'Generate 1:0 per strength & health on hit',
	clear: 'Remove statuses from target creature, reduce delays by 1, & heal 1',
	cold: '30% chance to freeze non-ranged attackers for 3',
	corpseexplosion: [
		'Sacrifice a creature to deal 1 spell damage to all creatures. Increment damage per 8 health of sacrifice. Poisonous sacrifices poison foe',
		'Sacrifice a creature to deal 1 spell damage to all enemy creatures. Increment damage per 8 health of sacrifice. Poisonous sacrifices poison foe',
	],
	counter: 'Attack attacker when attacked & able to attack',
	countimmbur: 'Increment attack per immaterial or burrowed instance',
	cpower: 'Target gains 1 to 5 strength & 1 to 5 health',
	creatureupkeep: 'All creatures require upkeep when attacking',
	cseed: 'A random effect is inflicted to target creature',
	cseed2: 'A truly random effect is inflicted to target',
	darkness: 'Produce 1:11 per turn',
	deadalive: {
		hit: 'Trigger a death effect on hit',
		cast: 'Trigger a death effect',
	},
	deathwish: 'Intercepts targeting on allies',
	deckblast: 'Spell damage foe per card in deck. Discard deck',
	deepdive:
		'Burrow, replace active with "2:3 Freeze target permanent" while burrowed, next turn unburrow into the air & triple strength until next attack',
	deja: 'Remove active & summon copy',
	deployblobs: 'Summon 3 Blobs & gain -2|-2',
	despair:
		'Non-ranged attackers have a 40%, plus 5% per 1:11 producing creature possessed, chance to gain -1|-1',
	destroy: 'Destroy target permanent',
	destroycard: 'Discard target card, or mill target player',
	detain: 'Drain 1|1 from target creature with less HP, & burrow them',
	devour: 'Kill target creature with less HP & gain 1|1',
	die: 'Sacrifice',
	disarm: "Return foe's weapon to their hand on hit",
	discping: 'Deal 1 damage to target creature & return to hand',
	disfield: 'Absorb damage. Consume 1:0 per damage absorbed',
	disshield: 'Absorb damage. Consume 1:1 per 3 damage absorbed',
	divinity: 'Add 24 to maximum health & heal 16',
	dive: 'Double strength until next attack. Does not stack',
	dmgproduce: 'Generate 1:0 per damage dealt',
	draft:
		'Target airborne creature loses airborne status, or vice versa. Becoming airborne gains 3|0, losing airborne deals 3 spell damage',
	drainlife: 'Drains 2HP from target. Increment drain per 5:11 owned',
	drawcopy: 'When foe discards a card, generate a copy',
	drawequip: 'Draw next weapon or shield',
	drawpillar: 'When played, if next draw is a pillar, draw it',
	dryspell:
		'Deal 1 spell damage to all creatures. Gain 1:7 per damage dealt. Removes cloak',
	dshield: 'Become immaterial until next turn',
	duality: "Generate a copy of foe's next draw",
	earth: 'Produce 1:4 per turn',
	earthquake: 'Destroy up to 3 stacks from target permanent',
	eatspell: 'Absorb next spell, gaining 1|1',
	elf: 'Become Fallen if target of Chaos Seed',
	embezzle:
		'Replaces target creature\'s skills with "Defender draws on hit. On death, foe mills 3"',
	embezzledeath: 'On death, foe mills 3',
	empathy:
		'Heal owner per creature owned per turn. Consumes 1:5 per 8 creatures',
	enchant: 'Target permanent becomes immaterial',
	endow: 'Gain attack, skills, & statuses of target weapon. Gain 0|2',
	envenom:
		'Target weapon or shield gains "Apply poison on hit. Throttled" & "25% chance to poison non-ranged attackers"',
	epidemic: "When a creature dies, transfer creature's poison counters to foe",
	epoch: 'Silence player after playing 2 cards in a turn',
	epochreset: {
		cast: 'Reset silence counter',
	},
	evade: x => x + '% chance to evade',
	evade100: '100% chance to evade',
	evadecrea: "Evades foe's creatures' targeting",
	evadespell: "Evades foe's targeting spells",
	evolve: 'Become an unburrowed Shrieker',
	feed: 'Poison target creature & gain 3|3, but rematerialize',
	fickle: 'Swap target card with random affordable card from deck',
	fiery: 'Increment damage per 5:6 owned',
	fire: 'Produce 1:6 per turn',
	firebolt:
		'Deals 3 spell damage to target. Increment damage per 4:6 owned. Thaws target',
	firewall: 'Damage non-ranged attackers',
	flatline: 'Foe produces no quanta until next turn',
	flyself:
		'If equiped, cast Flying Weapon on self. Otherwise cast Living Weapon on self',
	flyingweapon: 'Target weapon becomes a flying creature',
	foedraw: "Draw from foe's deck",
	forcedraw: 'Defender draws on hit',
	forceplay: 'Owner of target activates target',
	fractal:
		"Generate 6 copies of target creature's card. Consumes remaining 1:12. Generate another copy per 2:12 consumed",
	freeevade:
		'Own airborne creatures have a 30% chance to either deal 50% more damage or bypass shields. 20% chance to evade targeting',
	freeze: [
		'Freeze target for 3 turns. Being frozen disables attacking & per turn skills',
		'Freeze target for 4 turns. Being frozen disables attacking & per turn skills',
	],
	freezeperm: [
		'Freeze target non stacking permanent for 3 turns. Being frozen disables per turn skills',
		'Freeze target non stacking permanent for 4 turns. Being frozen disables per turn skills',
	],
	fungusrebirth: ['Become a Fungus', 'Become a Toxic Fungus'],
	gaincharge2: {
		death: 'Gain 2 stacks per death',
		destroy: 'Gain 2 stacks per other destruction',
	},
	gaintimecharge: 'Gain a stack per own non-drawstep draw, up to 4 per turn',
	gas: 'Summon an Unstable Gas',
	grave:
		"When a death occurs, unburrowed & become of dying's kind. Maintain nocturnal",
	give: c =>
		`Give own target to foe. Heal self ${
			c.upped ? 10 : 5
		}. Ignore sanctuary, may target immaterial`,
	golemhit: 'Target golem attacks. May target immaterial',
	gpull: 'Intercept attacks directed to owner',
	gpullspell: 'Target creature intercepts attacks directed to its owner',
	gratitude: 'Heal owner 4',
	growth: (atk, hp = atk) => {
		const x = `${atk}|${hp}`;
		return {
			death: `When a death occurs, gain ${x}`,
			ownfreeze: `Gains ${x} instead of freezing`,
			cast: `Gain ${x}`,
			ownattack: `Gain ${x} per turn`,
		};
	},
	guard:
		'Delay target creature & attack target if grounded or caster airborne. Delay self',
	halveatk: 'Attack is halved after attacking',
	hasten: {
		cast: 'Draw',
		owndiscard: 'Draw on discard',
	},
	hatch: 'Become a random creature',
	heal: 'Heal target 20',
	heatmirror: c =>
		'Heat Lightning: When foe plays a creature from hand, summon a ' +
		(c.upped ? 'Ball Lightning' : 'Spark'),
	hitownertwice: 'Attack owner twice when attacking',
	holylight: 'Heal target 10. Nocturnal targets are spell damaged instead',
	hope: 'Increment damage reduction per own 1:8 producing creature',
	icebolt:
		'Deal 2 spell damage to target. Increment damage per 5:7 owned. May freeze target',
	ignite: 'Deal 20 spell damage to foe & 1 spell damage to all creatures',
	immolate: c =>
		`Sacrifice a creature to produce ${
			c.upped ? 7 : 5
		}:6 & 1 quanta of each element`,
	improve: 'Mutate target creature',
	inertia: 'When own is targeted, produce 2:3',
	infect: 'Poison target creature',
	inflation: 'Increase cost of all actives by 1',
	ink: 'Summon a Cloak which lasts 1 turn',
	innovation: 'Discard target card, owner draws 3. Mill self one',
	integrity: 'Combine all shards in hand to form a Shard Golem',
	jelly:
		'Target creature becomes a 7|4 Pink Jelly with active Pink Jelly costing 4 of their element',
	jetstream: 'Target airborne creature gains 3|-1',
	light: 'Produce 1:8 per turn',
	lightning: 'Deal 5 spell damage to target',
	liquid:
		'Target creature is poisoned & skills are replaced with "Heal owner per damage dealt"',
	livingweapon:
		"Target creature becomes equipped as a weapon, unequiping any prewielded weapon. Heal target's owner for health of target",
	lobotomize: 'Remove skills from target creature',
	locket: 'Produce quanta of mark',
	locketshift: "Now produces quanta of target's element",
	loot: 'Steal a random permanent from foe when own permanent is destroyed',
	losecharge: (c, inst) => {
		const charges = c.getStatus('charges');
		return `Lasts ${charges} turn${charges === 1 ? '' : 's'}`;
	},
	luciferin:
		'All own creatures without skills produce 1:8 per turn. Heal owner 10',
	lycanthropy: 'Gain 5|5 & become nocturnal',
	martyr: 'Increment strength per damage received',
	mend: 'Heal target creature 10',
	metamorph: "Change mark to target's element. Increase mark power by 1",
	midas: 'Target permanent becomes a Golden Relic with "2:0: Sacrifice & draw"',
	millpillar: "If top of target player's deck is a pillar, mill target",
	mimic:
		'Mimic: whenever a creature enters play, become its kind. Retain Mimic',
	miracle: 'Heal self to one below maximum HP. Consumes remaining 1:8',
	mitosis: 'Cast own card',
	mitosisspell:
		'Creature gains 0|1 & active "Cast own card" costing target\'s card\'s cost',
	momentum: 'Target ignores shield effects & gains 1|1',
	mummy: 'Become a Pharaoh if target of Rewind',
	mutation:
		'Mutate target creature into an abomination, or maybe something more. Slight chance of death',
	mutant: 'Enter with mutant abilities',
	neuro:
		'Apply poison on hit, also inflicting neurotoxin. Neurotoxin applies poison per card played by victim. Throttled',
	neuroify:
		'Gives foe neurotoxin status if they are already poisoned. Remove purify counters',
	nightmare: c =>
		`Fill foe's hand with copies of target creature's card. Drain ${
			c.upped ? '2' : '1'
		} HP per added card`,
	nightshade:
		'Target creatures becomes nocturnal, gains 5|5, & has their active cleared',
	nova:
		'Produce 1 quanta of each element. Increment singularity danger by 2. Summon singularity if danger exceeds 5',
	nova2:
		'Produce 2 quanta of each element. Increment singularity danger by 3. Summon singularity if danger exceeds 5',
	nullspell: 'Cancel next spell until next turn, gaining 1|1',
	nymph: 'Turn target pillar into a Nymph of same element',
	obsession: [
		'spell damage owner 8 on discard',
		'spell damage owner 10 on discard',
	],
	ouija: "When a death occurs, generate Ouija Essence in foe's hand",
	pacify: "Reduce target's attack to 0",
	pairproduce: 'Activate own pillars',
	paleomagnetism: {
		ownattack: [
			"Summon a pillar matching mark per turn. Third chance to summon a pillar matching foe's mark",
			"Summon a tower matching mark per turn & on play. Third chance to summon a tower matching foe's mark",
		],
	},
	pandemonium: 'Random effects are inflicted to all creatures. Removes cloak',
	pandemonium2:
		"Random effects are inflicted to target player's creatures. Removes cloak",
	pandemonium3: 'Truly random effects are inflicted to all. Removes cloak',
	paradox: 'Kill target creature with greater strength than it has HP',
	parallel: 'Duplicate target creature',
	phoenix: ['Become an Ash on death', 'Become a Minor Ash on death'],
	photosynthesis: 'Produce 2:5. May activate multiple times',
	pillar: c => `Produce ${c.element ? 1 : 3}:${c.element} per turn`,
	pend: c =>
		`Oscilliate between producing ${c.element ? 1 : 3}:${
			c.element
		} & quanta of mark`,
	plague: "Poison target player's creatures. Removes cloak",
	platearmor: ['Target gains 0|4', 'Target gains 0|6'],
	poison: x => {
		x = `Apply ${x === '1' ? '' : x + ' '}poison `;
		return {
			hit: `${x} on hit. Throttled`,
			cast: `${x} to foe`,
		};
	},
	poisonfoe: 'May apply poison to foe on play',
	powerdrain:
		"Drain half target creature's strength & health, adding it to one of own creatures",
	precognition: "Reveal foe's hand until end of their turn. Draw",
	predator:
		'Attack again if foe holds more than 4 cards, discard their last card if so',
	protectall:
		'Bubble all own creatures & permanents. Bubbles protect from next targeting of foe or spell damage',
	protectonce: 'Evade next targeting, or prevent next source of spell damage',
	purify: 'Remove poison & sacrifice. Apply 2 purify',
	quantagift: 'Gain 2:7 & 2 quanta of mark. Produce only 3:7 if mark is 1:7',
	quint: 'Target creature becomes immaterial. Thaws',
	quinttog:
		'Target immaterial becomes material. Otherwise material targets become immaterial & thaw',
	rage: [
		'Target creature gains +5|-5. Thaws',
		'Target creature gains +6|-6. Thaws',
	],
	randomdr: c => `Damage reduction becomes 0 to ${c.upped ? 3 : 2} on play`,
	readiness:
		"Target creature's active becomes costless. Skill can be reactivated",
	readyequip: 'Remove summoning sickness when equipment becomes equipped',
	reap: 'Target creature dies & is reborn a skeleton with same stats',
	rebirth: ['Become a Phoenix', 'Become a Minor Phoenix'],
	reducemaxhp: 'Reduce maximum HP per damage dealt',
	regen: 'Apply 1 purify to owner on hit. Throttled',
	regenerate: 'Heal owner 5 per turn',
	regeneratespell:
		'Replace non-stacking target\'s skills with "Regenerate: Heal owner 5"',
	regrade: 'Invert upgraded status of target. Produce 1 quanta of that element',
	reinforce: 'Target creature absorbs caster, gaining its stats',
	ren: "Target creature will return to owner's hand instead of dying",
	rewind: "Return target creature to top of owner's deck",
	reveal: {
		ownplay: "Reveal foe's hand",
	},
	ricochet:
		'Targeting spells affect an additional random non player target. Caster randomised',
	sadism: [
		'Owner is healed however much their creatures are damaged',
		'Owner is healed however much creatures are damaged',
	],
	salvage:
		'Restore a permanent destroyed by foe to hand once per turn.\nGain 1|1 when a permanent is destroyed',
	salvageoff: 'Become ready to salvage again at start of next turn',
	sanctify: "Protection during foe's turn from hand & quanta control",
	unsanctify: {
		ownplay: "Prevent foe's sanctification",
	},
	scatterhand:
		'Target player shuffles their hand, & draws per card shuffled. Draw',
	scramble: {
		hit: "Randomly scramble 9 of foe's quanta on hit",
		cast: "Randomly scramble 9 of target player's quanta",
	},
	serendipity: [
		'Generate 3 random non-pillar cards in hand. One will be 1:1',
		'Generate 3 random non-pillar upgraded cards in hand. One will be 1:1',
	],
	shtriga: 'Become immaterial at start of turn',
	shuffle3:
		"Shuffle 3 copies of target creature or opponent's instance into own deck",
	silence:
		'Target player cannot play cards until their turn ends, or target creature gains summoning sickness',
	sing: 'Target creature without Sing attacks owner',
	singularity: 'Not well behaved',
	sinkhole: [
		"Target creature is burrowed. Replace creature's skills with 1:4: unburrow",
		"Target creature is burrowed. Replace creature's skills with 2:4: unburrow",
	],
	siphon: 'Siphon 1:0 from foe as 1:11. Throttled',
	siphonactive: "Steal target creature's skills. May activate again this turn",
	siphonstrength: 'Absorb 1|0 from target creature',
	skeleton: 'Become a random creature if target of Rewind',
	skull:
		'Attacking creatures may die & become skeletons. Creatures with lower HP more likely to die',
	skyblitz: 'Dive all own airborne creatures. Consumes remaining 1:9',
	slow: 'Delay non-ranged attackers',
	snipe: 'Deal 3 damage to target creature',
	solar: 'Produce 1:8 per attacker',
	sosa: [
		'Sacrifice 48% of maximum health & consume all non 1:2 to invert damage for 2 turns. Sacrifices at least 48HP',
		'Sacrifice 40% of maximum health & consume all non 1:2 to invert damage for 2 turns. Sacrifices at least 40HP',
	],
	soulcatch: 'When a death occurs, produce 3:2',
	spores: ['Summon 2 spores on death', 'Summon 2 toxic spores on death'],
	sskin: 'Increment maximum HP per 1:4 owned. Heal same',
	stasis: 'Prevent creatures from attacking at end of turn',
	static: 'Deal 2 spell damage to foe per attacker',
	steal: 'Steal target permanent',
	steam:
		'Gain 5 steam. Increment strength per steam. Steam decrements after attacking',
	stoneform: 'Gain 0|20 & become a golem',
	storm: x =>
		`Deals ${x} spell damage to target player's creatures. Removes cloak`,
	summon: x => c => `Summon a ${Names[x].name}`,
	swarm: 'Base health is equal to count of ally scarabs',
	swave:
		'Deals 4 spell damage to target. Instantly kill creature or destroy weapon if frozen',
	tempering: [
		'Target weapon deals an additional 3 damage per turn. Thaws',
		'Target weapon deals an additional 5 damage per turn. Thaws',
	],
	tesseractsummon:
		'Summon 2 creatures from own deck, foe summons 1 creature from their deck. Freeze summoned creatures by a quarter of their cost, rounded up',
	thorn: '75% chance to poison non-ranged attackers',
	throwrock: [
		"Deal 3 damage to target creature, then shuffle Throw Rock into target's deck",
		"Deal 4 damage to target creature, then shuffle Throw Rock into target's deck",
	],
	tick: [
		'Takes 1 damage. If damage results in death, deal 18 spell damage to foe',
		"Takes 3 damage. If damage results in death, deal 4 spell damage to all foe's creatures",
	],
	tidalhealing:
		'Remove poison & freezing from own creatures. Own aquatic creatures gain "Apply 1 purify to owner on hit. Throttled". Does not stack',
	tornado: [
		"Randomly reshuffle 2 of foe's permanents & one of own into either deck",
		"Randomly reshuffle 2 of foe's permanents into either deck",
	],
	trick: 'Swap target creature with a different creature from deck',
	turngolem:
		'Become a creature which intercepts attacks with health per damage blocked & half as much strength',
	unburrow: 'Unburrow',
	unsummon:
		"Return target creature to owner's hand. If hand full, return to top of deck",
	unvindicate: 'Become ready to vindicate again at start of next turn',
	upkeep: c => 'Consumes 1:' + c.element,
	upload: 'Target gains 2|0 & Byt gains 0|-2',
	vampire: 'Heal owner per damage dealt',
	vend: 'Sacrifice & draw',
	vengeance:
		"When an ally death occurs, during foe's turn, expend a stack & ally creatures attack",
	vindicate: 'When an ally death occurs, it attacks again. Unready',
	virtue: "Increment owner's maximum health by damge blocked when attacking",
	virusdeath: 'Apply 1 poison to foe on death',
	virusinfect: 'Sacrifice self & poison target',
	virusplague: "Sacrifice self & poison target player's creatures",
	void: "Reduce foe's maximum HP by 3",
	voidshell: 'Absorb damage. Reduce maximum HP per damage absorbed',
	web: 'Target creature loses airborne',
	weight: 'Evade creatures with more than 5 HP',
	wind: 'Restore attack',
	wings: 'Evade non-airborne & non-ranged attackers',
	wisdom: 'Target gains 3|0. May target immaterial, granting psionic',
	yoink: "Steal foe's target card, or draw from foe's target player's deck",
};
for (const [key, text] of [
	['dagger', '1:2 1:11. Increment damage per own cloak'],
	['hammer', '1:3 1:4'],
	['bow', '1:8 1:9'],
	['staff', '1:5 1:7'],
	['disc', '1:1 1:12'],
	['axe', '1:6 1:10'],
]) {
	data[key] = 'Increment damage if mark is ' + text;
}
for (const [key, text] of [
	['pillmat', '1:4 1:6 1:7 1:9'],
	['pillspi', '1:2 1:5 1:8 1:11'],
	['pillcar', '1:1 1:3 1:10 1:12'],
]) {
	data[key] = {
		ownattack: `Produce 1 or 2 ${text} per turn`,
		ownplay: `Produce 1 or 2 ${text} on play`,
	};
}
function auraText(tgts, bufftext, upbufftext) {
	return c =>
		`${tgts} gain ${c.upped ? upbufftext : bufftext} while ${
			c.name
		} in play. Unique`;
}
const statusData = {
	cloak: 'Cloaks own field',
	charges: (c, inst) =>
		c !== inst ||
		Thing.prototype.hasactive.call(c, 'ownattack', 'losecharge') ||
		c.getStatus('charges') === 1
			? ''
			: `Enter with ${c.getStatus('charges') +
					(c.getStatus('stackable') ? ' stacks' : ' charges')}`,
	flooding:
		'Non aquatic creatures past first five creature slots die on turn end. Consumes 1:7. Unique',
	nightfall: auraText('Nocturnal creatures', '1|1', '2|1'),
	nothrottle:
		'Throttling does not apply to any of own creatures while equipped',
	patience:
		'Prevent own creatures from attacking at end of turn. They gain 2|1. 4|1 if burrowed. 5|2 if flooded. Unique',
	poison: (c, inst) =>
		c === inst
			? `Enter with ${c.getStatus('poison')} poison`
			: inst.getStatus('poison') + ' poison',
	stackable: '',
	tunnel: 'Burrowed creatures bypass shields',
	voodoo: 'Repeat to foe negative status effects & non lethal damage',
	whetstone: auraText('Weapons & golems', '1|1', '1|2'),
};
function processEntry(c, event, entry) {
	return typeof entry === 'string'
		? entry
		: entry instanceof Array
		? entry[asCard(c).upped ? 1 : 0]
		: entry instanceof Function
		? entry(asCard(c), c)
		: event in entry
		? processEntry(c, event, entry[event])
		: '';
}
function asCard(c) {
	return c instanceof Card ? c : c.card;
}
function pushEntry(list, c, event, entry) {
	const x = processEntry(c, event, entry);
	if (x) list.push(x);
}
const cache = new Map();
function getDataFromName(name) {
	if (name in data) return data[name];
	if (cache.has(name)) return cache.get(name);
	const [base, ...args] = name.split(' ');
	if (base in data) {
		const r = data[base](...args);
		cache.set(name, r);
		return r;
	}
	cache.set(name, undefined);
	return undefined;
}
