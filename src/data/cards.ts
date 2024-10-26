type Card = {
    id: number;
    img: string;
    name: string;
    atk: number;
    hp: number;
    connect: number;
    red: number;
    green: number;
    blue: number;
    type: string;
    ability: string;
    style: string;
    cost: number;
    desc: string;
};
  
type CardsObject = {
    [key in 'basic' | 'general' | 'hero']: {
        [key: number]: Card;
    };
};

export const basicCards = [
    {img : "Warrior1", name : "Warrior", atk : 1, hp : 2, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Soldier", style : "Passive", cost : 0, desc : "A brave soldier for your army",},
    {img : "Warrior2", name : "Warrior", atk : 1, hp : 2, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Soldier", style : "Passive", cost : 0, desc : "A brave soldier for your army",},
    {img : "Warrior3", name : "Warrior", atk : 1, hp : 2, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Soldier", style : "Passive", cost : 0, desc : "A brave soldier for your army",},
    {img : "Warrior4", name : "Warrior", atk : 1, hp : 2, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Soldier", style : "Passive", cost : 0, desc : "A brave soldier for your army",},
    {img : "Archer1", name : "Archer", atk : 1, hp : 1, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Ranged", style : "Passive", cost : 0, desc : "All attacks are ranged",},
    {img : "Archer2", name : "Archer", atk : 1, hp : 1, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Ranged", style : "Passive", cost : 0, desc : "All attacks are ranged",},
    {img : "Horseman1", name : "Horseman", atk : 2, hp : 2, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Charge", style : "Bolt", cost : 0, desc : "Can always attack first",},
    {img : "Horseman2", name : "Horseman", atk : 2, hp : 2, connect : 2, red : 0, green : 0, blue : 0, type : "basic", ability : "Charge", style : "Bolt", cost : 0, desc : "Can always attack first",},
    {img : "Helmet1", name : "Helmet", atk : 1, hp : 2, connect : 1, red : 0, green : 0, blue : 0, type : "basic", ability : "Equipment", style : "Passive", cost : 0, desc : "A trusty helmet",},
    {img : "Helmet2", name : "Helmet", atk : 1, hp : 2, connect : 1, red : 0, green : 0, blue : 0, type : "basic", ability : "Equipment", style : "Passive", cost : 0, desc : "A trusty helmet",},
    {img : "Shield1", name : "Shield", atk : 1, hp : 2, connect : 1, red : 0, green : 0, blue : 0, type : "basic", ability : "Equipment", style : "Passive", cost : 0, desc : "A tough shield",},
    {img : "Shield2", name : "Shield", atk : 1, hp : 2, connect : 1, red : 0, green : 0, blue : 0, type : "basic", ability : "Equipment", style : "Passive", cost : 0, desc : "A tough shield",},
    {img : "Sword1", name : "Sword", atk : 1, hp : 2, connect : 1, red : 0, green : 0, blue : 0, type : "basic", ability : "Equipment", style : "Passive", cost : 0, desc : "A sharp sword",},
    {img : "Sword2", name : "Sword", atk : 1, hp : 2, connect : 1, red : 0, green : 0, blue : 0, type : "basic", ability : "Equipment", style : "Passive", cost : 0, desc : "A sharp sword",},
];

export const battleCards = [
    {img : "Leuctra", ability : "The Battle of Leuctra", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "PeloponnesianWar", ability : "The Peloponnesian War", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "TrojanWar", ability : "The Trojan War", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "Thermopylae", ability : "The Battle of Thermopylae", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "Salamis", ability : "The Battle of Salamis", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "Marathon", ability : "The Battle of Marathon", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "Syracuse", ability : "The Battle of Syracuse", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
    {img : "Titanomachy", ability : "The Titanomachy", atk : 1, hp : 2, connect : 0, red : 0, green : 0, blue : 0, type : "battle", name : "Battle", style : "Passive", cost : 0, desc : "",},
];

export const heroCards = [
// Heroes - 58
    {img : "Heracles", name : "Heracles", atk : 6, hp : 9, connect : 4, red : 3, green : 1, blue : 0, type : "hero", ability : "Strength of the Gods", style : "Bolt", cost : 3, desc : "Deal +3 dmg on first attack",},
    {img : "Perseus", name : "Perseus", atk : 4, hp : 8, connect : 4, red : 1, green : 2, blue : 1, type : "hero", ability : "Medusa's Gaze", style : "Bolt", cost : 3, desc : "Stun 2 Enemies",},
    {img : "Achilles", name : "Achilles", atk : 5, hp : 9, connect : 4, red : 4, green : 0, blue : 0, type : "hero", ability : "Quelling Blade", style : "Passive", cost : 3, desc : "Deal +2 dmg against units who have lost hp",},
    {img : "Jason", name : "Jason", atk : 3, hp : 5, connect : 4, red : 1, green : 1, blue : 2, type : "hero", ability : "Heroic Connections", style : "Passive", cost : 3, desc : "Heroes cost 1 less card to recruit",},
    {img : "Odysseus", name : "Odysseus", atk : 4, hp : 8, connect : 4, red : 0, green : 1, blue : 3, type : "hero", ability : "Set Trap", style : "Bolt", cost : 3, desc : "Stun or deal 2 dmg to an enemy or swap 2 enemy cards",},
    {img : "Diomedes", name : "Diomedes", atk : 5, hp : 8, connect : 4, red : 2, green : 2, blue : 0, type : "hero", ability : "Battle Hunger", style : "Passive", cost : 3, desc : "Diomedes takes -1 dmg from non heroes",},
    {img : "Ajax", name : "Ajax", atk : 5, hp : 10, connect : 4, red : 3, green : 1, blue : 0, type : "hero", ability : "Bulwark", style : "Passive", cost : 3, desc : "Connected cards receive one less dmg when attacked",},
    {img : "Minos", name : "Minos", atk : 3, hp : 6, connect : 3, red : 3, green : 0, blue : 0, type : "hero", ability : "Royal Hatred", style : "Passive", cost : 2, desc : "Deal +2 dmg to blue cards",},
    {img : "Nestor", name : "Nestor", atk : 2, hp : 7, connect : 3, red : 0, green : 0, blue : 3, type : "hero", ability : "Age-old Wisdom", style : "Bolt", cost : 2, desc : "Switch 2 enemy cards and heal 2 dmg on an ally",},
    {img : "Atalanta", name : "Atalanta", atk : 4, hp : 4, connect : 3, red : 0, green : 3, blue : 0, type : "hero", ability : "Swift-footed Archer", style : "Passive", cost : 2, desc : "Attacks are ranged and can always attack first",},
    {img : "Medea", name : "Medea", atk : 1, hp : 5, connect : 3, red : 1, green : 0, blue : 2, type : "hero", ability : "Nullify", style : "Bolt", cost : 2, desc : "Stun an enemy and deal 2 dmg",},
    {img : "Ariadne", name : "Ariadne", atk : 1, hp : 4, connect : 2, red : 0, green : 1, blue : 1, type : "hero", ability : "Loyal Companion", style : "Bolt", cost : 1, desc : "Can heal two dmg on an ally",},
    {img : "Hippolyta", name : "Hippolyta", atk : 5, hp : 5, connect : 4, red : 0, green : 4, blue : 0, type : "hero", ability : "Master Huntress", style : "Passive", cost : 3, desc : "Attacks are ranged and deal +1 dmg",},
    {img : "Penelope", name : "Penelope", atk : 1, hp : 4, connect : 2, red : 0, green : 0, blue : 2, type : "hero", ability : "Faithful", style : "Bolt", cost : 1, desc : "Can heal two dmg on an ally",},
    {img : "Meleager", name : "Meleager", atk : 4, hp : 5, connect : 3, red : 2, green : 1, blue : 0, type : "hero", ability : "Hunter's Instinct", style : "Passive", cost : 2, desc : "Takes -1 dmg from units with less attack than him",},
    {img : "Bellerophon", name : "Bellerophon", atk : 4, hp : 4, connect : 3, red : 1, green : 2, blue : 0, type : "hero", ability : "Monster Hunter", style : "Passive", cost : 2, desc : "Immune to dmg from monsters",},
    {img : "Daedalus", name : "Daedalus", atk : 1, hp : 4, connect : 3, red : 0, green : 0, blue : 3, type : "hero", ability : "Master Craftsman", style : "Bolt", cost : 2, desc : "Switch two enemy cards",},
    {img : "Pandora", name : "Pandora", atk : 1, hp : 3, connect : 2, red : 0, green : 1, blue : 1, type : "hero", ability : "Chaotic Curiosity", style : "Bolt", cost : 1, desc : "Roll dice : if 3<X deal +X/2 dmg else take X dmg",},
    {img : "Cassandra", name : "Cassandra", atk : 1, hp : 3, connect : 2, red : 0, green : 0, blue : 2, type : "hero", ability : "Cursed Prophecy", style : "Passive", cost : 1, desc : "Prevent an enemy ability, then die",},
    {img : "Neoptolemus", name : "Neoptolemus", atk : 4, hp : 5, connect : 3, red : 3, green : 0, blue : 0, type : "hero", ability : "His Father's Rage", style : "Passive", cost : 2, desc : "Deal +2 dmg to blue cards",},
    {img : "Clytemnestra", name : "Clytemnestra", atk : 2, hp : 3, connect : 2, red : 2, green : 0, blue : 0, type : "hero", ability : "Hero Slayer", style : "Passive", cost : 1, desc : "Deal +5 dmg to heroes",},
    {img : "Orpheus", name : "Orpheus", atk : 1, hp : 4, connect : 2, red : 0, green : 1, blue : 1, type : "hero", ability : "Master of Music", style : "Bolt", cost : 1, desc : "Heal all units by one",},
    {img : "Patroclus", name : "Patroclus", atk : 3, hp : 7, connect : 3, red : 2, green : 0, blue : 1, type : "hero", ability : "Brotherly Love", style : "Passive", cost : 2, desc : "Take dmg in place of another",},
    {img : "Theseus", name : "Theseus", atk : 5, hp : 8, connect : 4, red : 1, green : 2, blue : 1, type : "hero", ability : "Liberator of Athens", style : "Passive", cost : 3, desc : "Reduces dmg from incoming attacks by 1",},
    {img : "Alcibiades", name : "Alcibiades", atk : 3, hp : 2, connect : 2, red : 1, green : 0, blue : 1, type : "hero", ability : "Disloyal", style : "Passive", cost : 1, desc : "On first death transfer to the killer's team with 1 health",},
    {img : "Hippolytus", name : "Hippolytus", atk : 2, hp : 4, connect : 2, red : 0, green : 2, blue : 0, type : "hero", ability : "Call of the Wild", style : "Passive", cost : 1, desc : "Monsters cost -1 card to recruit",},
    {img : "Cecrops", name : "Cecrops", atk : 1, hp : 4, connect : 2, red : 0, green : 0, blue : 2, type : "hero", ability : "Experienced Ruler", style : "Bolt", cost : 2, desc : "Draw a basic card",},
    {img : "Menelaus", name : "Menelaus", atk : 5, hp : 7, connect : 4, red : 3, green : 1, blue : 0, type : "hero", ability : "Duelist", style : "Bolt", cost : 3, desc : "Attack an enemy until one dies, take -1 dmg per attack",},
    {img : "Helen", name : "Helen", atk : 1, hp : 5, connect : 3, red : 1, green : 1, blue : 1, type : "hero", ability : "Casus Belli", style : "Bolt", cost : 1, desc : "Place in the enemy army, all surrounding cards take +1 dmg",},
    {img : "Brasidas", name : "Brasidas", atk : 3, hp : 6, connect : 3, red : 2, green : 0, blue : 1, type : "hero", ability : "Master Tactician", style : "Passive", cost : 2, desc : "You can rearrange your army at any point in a battle",},
    {img : "Orestes", name : "Orestes", atk : 3, hp : 5, connect : 3, red : 3, green : 0, blue : 0, type : "hero", ability : "Vengeful", style : "Passive", cost : 2, desc : "Everytime Orestes is attacked, he deals x2 his attack back",},
    {img : "Oedipus", name : "Oedipus", atk : 3, hp : 5, connect : 3, red : 0, green : 2, blue : 1, type : "hero", ability : "Ill-Fated", style : "Passive", cost : 2, desc : "Deal +2 dmg to red cards but -2 dmg to blue",},
    {img : "Tiresias", name : "Tiresias", atk : 0, hp : 4, connect : 2, red : 0, green : 0, blue : 2, type : "hero", ability : "Foresight", style : "Passive", cost : 1, desc : "Prevent an enemy ability, then die",},
    {img : "Hector", name : "Hector", atk : 5, hp : 8, connect : 4, red : 2, green : 1, blue : 1, type : "hero", ability : "Sweeping Attack", style : "Bolt", cost : 3, desc : "Deal 1 dmg to all connected cards, 2 if they are green",},
    {img : "Paris", name : "Paris", atk : 4, hp : 5, connect : 3, red : 2, green : 1, blue : 0, type : "hero", ability : "Master Archer", style : "Passive", cost : 2, desc : "Attacks are ranged, deal +1 to red cards",},
    {img : "Hecuba", name : "Hecuba", atk : 1, hp : 4, connect : 3, red : 0, green : 1, blue : 2, type : "hero", ability : "Royal Influence", style : "Bolt", cost : 2, desc : "Can heal 2 dmg on an ally",},
    {img : "Peleus", name : "Peleus", atk : 3, hp : 4, connect : 3, red : 0, green : 2, blue : 1, type : "hero", ability : "Divine favour", style : "Passive", cost : 3, desc : "Reduces the cost of recruiting gods by 1 card",},
// Gods
    {img : "Dionysus", name : "Dionysus", atk : 4, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Festival Rites", style : "Passive", cost : 5, desc : "All soldiers have +1 atk and take -1 dmg",},
    {img : "Zeus", name : "Zeus", atk : 7, hp : 12, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Thunderer's Wrath", style : "Bolt", cost : 5, desc : "Deal 10 dmg to a mortal enemy",},
    {img : "Athena", name : "Athena", atk : 6, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Warrior Goddess", style : "Passive", cost : 5, desc : "Every time Athena kills an enemy, she is healed by 2",},
    {img : "Poseidon", name : "Poseidon", atk : 6, hp : 12, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Earthquake", style : "Bolt", cost : 5, desc : "Deal 1 damage to all enemies",},
    {img : "Hades", name : "Hades", atk : 5, hp : 12, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Lord of the Dead", style : "Passive", cost : 5, desc : "On defeat, place the last two killed units in your army",},
    {img : "Hera", name : "Hera", atk : 4, hp : 12, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Queen of the Gods", style : "Passive", cost : 5, desc : "Deal x2 dmg to heroes",},
    {img : "Ares", name : "Ares", atk : 4, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Thirst for War", style : "Passive", cost : 5, desc : "When Ares' health is below 50%, he deals x2 dmg",},
    {img : "Aphrodite", name : "Aphrodite", atk : 4, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Divine Feminine", style : "Passive", cost : 5, desc : "All female cards deal x2 dmg",},
    {img : "Apollo", name : "Apollo", atk : 5, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "God of Healing", style : "Bolt", cost : 5, desc : "Heal 4 hp on an ally, all attacks are ranged",},
    {img : "Demeter", name : "Demeter", atk : 3, hp : 9, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Bountiful Harvest", style : "Bolt", cost : 5, desc : "Draw a basic card and heal 4 hp on an ally",},
    {img : "Hermes", name : "Hermes", atk : 4, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Swift Footed", style : "Passive", cost : 5, desc : "All Green cards deal +1 dmg",},
    {img : "Hephaestus", name : "Hephaestus", atk : 3, hp : 9, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Divine Engineering", style : "Bolt", cost : 5, desc : "Stun 2 enemies and choose an ally to be taunted",},
    {img : "Artemis", name : "Artemis", atk : 5, hp : 10, connect : 4, red : 0, green : 0, blue : 0, type : "god", ability : "Goddess of the Hunt", style : "Passive", cost : 5, desc : "All attacks are ranged, deal +2 dmg to monsters",},
// Monsters
    {img : "Cyclops", name : "Cyclops", atk : 7, hp : 8, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Bolt", ability : "Devour", desc : "Eat a soldier",},
    {img : "Minotaur", name : "Minotaur", atk : 5, hp : 8, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Bolt", ability : "Savage Roar", desc : "Deal 1 dmg to all non-red cards in the enemy's army",},
    {img : "Hydra", name : "Hydra", atk : 3, hp : 10, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Passive", ability : "Poisoned Blood", desc : "The killer of the Hydra takes 5 dmg",},
    {img : "Medusa", name : "Medusa", atk : 4, hp : 9, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Passive", ability : "Stone Gaze", desc : "Any unit which attacks Medusa is stunned",},
    {img : "CretanBull", name : "Cretan Bull", atk : 4, hp : 8, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Bolt", ability : "Charge", desc : "Can always attack first, first attack deals +2 dmg",},
    {img : "Cerberus", name : "Cerberus", atk : 5, hp : 10, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Bolt", ability : "Triple Threat", desc : "Attack your target 3 times",},
    {img : "Chimera", name : "Chimera", atk : 6, hp : 9, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Bolt", ability : "Breath Fire", desc : "Deal 2 dmg to connecting cards",},
    {img : "NemeanLion", name : "Nemean Lion", atk : 5, hp : 7, connect : 4, red : 0, green : 0, blue : 0, cost: 4, type : "monster", style : "Passive", ability : "Thick Skinned", desc : "Reduces all incoming dmg by 1",},
];

export const generals = [
    {id: 1, img : "Agamemnon", name : "Agamemnon", atk : 2, hp : 10, connect : 4, red : 4, green : 0, blue : 0, type : "general", ability : "Leader of the Greeks", style : "Passive", cost : 0, desc : "All soldiers deal +1 dmg",},
    {id: 2, img : "Pericles", name : "Pericles", atk : 1, hp : 10, connect : 4, red : 0, green : 1, blue : 3, type : "general", ability : "Voice of Democracy", style : "Passive", cost : 0, desc : "Connected soldiers deal +2 dmg",},
    {id: 3, img : "Leonidas", name : "Leonidas", atk : 2, hp : 10, connect : 4, red : 3, green : 1, blue : 0, type : "general", ability : "Spartan Warcry", style : "Passive", cost : 0, desc : "Leonidas must be killed first by the enemy",},
    {id: 4, img : "Priam", name : "Priam", atk : 1, hp : 10, connect : 4, red : 1, green : 1, blue : 2, type : "general", ability : "Royal Wealth", style : "Bolt", cost : 0, desc : "Draw 5 basic cards on your first turn",},
    {id: 5, img : "Alexander", name : "Alexander", atk : 2, hp : 10, connect : 4, red : 0, green : 2, blue : 2, type : "general", ability : "Overwhelming Odds", style : "Passive", cost : 0, desc : "The last unit in the army has x2 attack",},
    {id: 6, img : "Dido", name : "Dido", atk : 2, hp : 10, connect : 4, red : 2, green : 0, blue : 2, type : "general", ability : "Ill-Fated Queen", style : "Passive", cost : 0, desc : "On death, Dido's killer dies as well",},
    {id: 7, img : "Cadmus", name : "Cadmus", atk : 2, hp : 10, connect : 4, red : 1, green : 2, blue : 1, type : "general", ability : "Founder's Spirit", style : "Passive", cost : 0, desc : "When all connections are filled, deal x2 dmg",},
    {id: 8, img : "Aeneas", name : "Aeneas", atk : 2, hp : 10, connect : 4, red : 2, green : 1, blue :1, type : "general", ability : "Divine Protection", style : "Passive", cost : 0, desc : "The first unit to die is resurrected at half hp",},
];

export const cards:CardsObject = {
    basic: {

    },
    hero: {

    },
    general: {
        1: {id: 1, img : "Agamemnon", name : "Agamemnon", atk : 2, hp : 10, connect : 4, red : 4, green : 0, blue : 0, type : "general", ability : "Leader of the Greeks", style : "Passive", cost : 0, desc : "All soldiers deal +1 dmg",},
        2: {id: 2, img : "Pericles", name : "Pericles", atk : 1, hp : 10, connect : 4, red : 0, green : 1, blue : 3, type : "general", ability : "Voice of Democracy", style : "Passive", cost : 0, desc : "Connected soldiers deal +2 dmg",},
        3: {id: 3, img : "Leonidas", name : "Leonidas", atk : 2, hp : 10, connect : 4, red : 3, green : 1, blue : 0, type : "general", ability : "Spartan Warcry", style : "Passive", cost : 0, desc : "Leonidas must be killed first by the enemy",},
        4: {id: 4, img : "Priam", name : "Priam", atk : 1, hp : 10, connect : 4, red : 1, green : 1, blue : 2, type : "general", ability : "Royal Wealth", style : "Bolt", cost : 0, desc : "Draw 5 basic cards on your first turn",},
        5: {id: 5, img : "Alexander", name : "Alexander", atk : 2, hp : 10, connect : 4, red : 0, green : 2, blue : 2, type : "general", ability : "Overwhelming Odds", style : "Passive", cost : 0, desc : "The last unit in the army has x2 attack",},
        6: {id: 6, img : "Dido", name : "Dido", atk : 2, hp : 10, connect : 4, red : 2, green : 0, blue : 2, type : "general", ability : "Ill-Fated Queen", style : "Passive", cost : 0, desc : "On death, Dido's killer dies as well",},
        7: {id: 7, img : "Cadmus", name : "Cadmus", atk : 2, hp : 10, connect : 4, red : 1, green : 2, blue : 1, type : "general", ability : "Founder's Spirit", style : "Passive", cost : 0, desc : "When all connections are filled, deal x2 dmg",},
        8: {id: 8, img : "Aeneas", name : "Aeneas", atk : 2, hp : 10, connect : 4, red : 2, green : 1, blue :1, type : "general", ability : "Divine Protection", style : "Passive", cost : 0, desc : "The first unit to die is resurrected at half hp",},
    }
}