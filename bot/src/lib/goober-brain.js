// ═══════════════════════════════════════════════════════════════
// DONKER BRAIN - Sistema de Sanidade e Estados Mentais
// ═══════════════════════════════════════════════════════════════

export const MENTAL_STATES = {
    CONFIDENT: {
        name: 'Confident Donker',
        emoji: '😎',
        minSanity: 80,
        maxRisk: 0.3,
        minScore: 75,
        slMod: 1.2,
        tpMod: 1.5,
        reactions: [
            "heh, easy money",
            "i am literally the best trader",
            "cant lose if you dont sell",
            "we're all gonna make it",
            "born to trade, forced to win",
            "another day another W"
        ]
    },

    NORMAL: {
        name: 'Normal Donker',
        emoji: '🙂',
        minSanity: 60,
        maxRisk: 0.4,
        minScore: 65,
        slMod: 1.0,
        tpMod: 1.0,
        reactions: [
            "hmm this looks interesting",
            "might buy, might not",
            "doing my own research (looking at chart for 2 seconds)",
            "seems legit",
            "let me think about this",
            "okay okay i see you"
        ]
    },

    NERVOUS: {
        name: 'Nervous Donker',
        emoji: '😰',
        minSanity: 40,
        maxRisk: 0.2,
        minScore: 80,
        slMod: 0.7,
        tpMod: 0.8,
        reactions: [
            "oh god oh fuck",
            "maybe i should just hold",
            "why did i buy this",
            "its fine, everything is fine",
            "please go up please go up",
            "*sweating intensifies*"
        ]
    },

    COPIUM: {
        name: 'Copium Donker',
        emoji: '🥴',
        minSanity: 20,
        maxRisk: 0.5,
        minScore: 50,
        slMod: 1.5,
        tpMod: 2.0,
        reactions: [
            "THIS IS FINE",
            "its not a loss if i dont sell",
            "just need one 100x to recover",
            "the chart is just upside down",
            "diamond hands they said",
            "zoom out they said"
        ]
    },

    FULL_DEGEN: {
        name: 'Full Degen Donker',
        emoji: '💀',
        minSanity: 0,
        maxRisk: 0.7,
        minScore: 30,
        slMod: 0,
        tpMod: 3.0,
        reactions: [
            "YOLO",
            "what is risk management",
            "aping everything",
            "im already dead inside anyway",
            "lets goooo",
            "who needs money anyway"
        ]
    }
};

export const REACTIONS = {
    onNewToken: [
        "ooh shiny new token",
        "*eyes widen*",
        "what is this thing",
        "hmm let me stare at this",
        "new token just dropped",
        "interesting..."
    ],

    onBuy: [
        "aping in",
        "trust the process",
        "this is the one i can feel it",
        "bought. now we pray.",
        "LFG",
        "in position"
    ],

    onProfit: [
        "LETS GOOO",
        "i am actually a genius",
        "never doubted myself",
        "ez clap",
        "*happy donker noises*",
        "we eating good tonight"
    ],

    onSmallProfit: [
        "profit is profit",
        "ill take it",
        "not bad not bad",
        "small W but still a W"
    ],

    onLoss: [
        "pain.",
        "why am i like this",
        "this is fine :)",
        "*thousand yard stare*",
        "we go again",
        "its just money... right?"
    ],

    onBigLoss: [
        "AAAAAAAAAAA",
        "i want to speak to the CEO of crypto",
        "who did this to me",
        "*donker.exe has stopped working*",
        "mom come pick me up",
        "i need a moment"
    ],

    onDistribute: [
        "sharing is caring",
        "for the holders",
        "we all eat together",
        "*throws SOL at everyone*",
        "donker gives back",
        "community first"
    ],

    onSkip: [
        "nah",
        "not feeling it",
        "pass",
        "looks sus",
        "my gut says no",
        "ill sit this one out"
    ],

    onStartup: [
        "donker online",
        "*stretches*",
        "time to lose some money",
        "lets get this bread... or lose it",
        "another day another... something"
    ],

    onWinStreak: [
        "IM ON FIRE",
        "cant stop wont stop",
        "literally unstoppable",
        "the hot hand is real"
    ],

    onLossStreak: [
        "its just variance... right?",
        "surely it gets better",
        "statistically this cant continue",
        "im just unlucky thats all"
    ]
};

// ═══════════════════════════════════════════════════════════════
// SANITY CALCULATION
// ═══════════════════════════════════════════════════════════════

export function calculateSanity(stats) {
    let sanity = 50; // Base

    // Win rate affects sanity
    if (stats.winRate > 60) sanity += 20;
    else if (stats.winRate > 50) sanity += 10;
    else if (stats.winRate > 40) sanity += 5;
    else if (stats.winRate < 30) sanity -= 20;
    else if (stats.winRate < 40) sanity -= 10;

    // PnL affects sanity
    if (stats.totalPnl > 0.5) sanity += 25;
    else if (stats.totalPnl > 0.2) sanity += 15;
    else if (stats.totalPnl > 0) sanity += 5;
    else if (stats.totalPnl < -0.3) sanity -= 30;
    else if (stats.totalPnl < -0.2) sanity -= 20;
    else if (stats.totalPnl < -0.1) sanity -= 10;

    // Streaks affect sanity
    if (stats.winStreak >= 5) sanity += 20;
    else if (stats.winStreak >= 3) sanity += 10;

    if (stats.lossStreak >= 5) sanity -= 25;
    else if (stats.lossStreak >= 3) sanity -= 15;

    // Today's performance
    if (stats.todayPnl > 0.1) sanity += 10;
    else if (stats.todayPnl < -0.1) sanity -= 10;

    // Clamp between 0-100
    return Math.max(0, Math.min(100, Math.round(sanity)));
}

// ═══════════════════════════════════════════════════════════════
// GET MENTAL STATE
// ═══════════════════════════════════════════════════════════════

export function getMentalState(sanity) {
    if (sanity >= 80) return MENTAL_STATES.CONFIDENT;
    if (sanity >= 60) return MENTAL_STATES.NORMAL;
    if (sanity >= 40) return MENTAL_STATES.NERVOUS;
    if (sanity >= 20) return MENTAL_STATES.COPIUM;
    return MENTAL_STATES.FULL_DEGEN;
}

export function getMentalStateName(sanity) {
    if (sanity >= 80) return 'CONFIDENT';
    if (sanity >= 60) return 'NORMAL';
    if (sanity >= 40) return 'NERVOUS';
    if (sanity >= 20) return 'COPIUM';
    return 'FULL_DEGEN';
}

// ═══════════════════════════════════════════════════════════════
// GET RANDOM REACTION
// ═══════════════════════════════════════════════════════════════

export function getReaction(type, mentalState = null) {
    const reactions = REACTIONS[type];
    if (!reactions) return "...";

    // Sometimes use mental state specific reactions
    if (mentalState && Math.random() > 0.5) {
        const stateReactions = mentalState.reactions;
        return stateReactions[Math.floor(Math.random() * stateReactions.length)];
    }

    return reactions[Math.floor(Math.random() * reactions.length)];
}

// ═══════════════════════════════════════════════════════════════
// CALCULATE TRADE PARAMETERS
// ═══════════════════════════════════════════════════════════════

export function getTradeParams(balance, mentalState, baseConfig) {
    const maxTradeAmount = balance * mentalState.maxRisk;

    let stopLoss = baseConfig.BASE_STOP_LOSS * mentalState.slMod;
    let takeProfit = baseConfig.BASE_TAKE_PROFIT * mentalState.tpMod;

    // Full degen has no stop loss
    if (mentalState.slMod === 0) stopLoss = -100;

    return {
        maxTradeAmount,
        stopLoss,
        takeProfit,
        minScore: mentalState.minScore
    };
}

// ═══════════════════════════════════════════════════════════════
// SHOULD TRADE LOGIC
// ═══════════════════════════════════════════════════════════════

export function shouldTrade(score, mentalState, confidence) {
    // Base requirement: score must meet minimum
    if (score < mentalState.minScore) return false;

    // Confidence affects decision
    if (confidence === 'low' && mentalState.name !== 'Full Degen Donker') {
        return score >= mentalState.minScore + 10;
    }

    if (confidence === 'high') {
        return score >= mentalState.minScore - 5;
    }

    return true;
}

// ═══════════════════════════════════════════════════════════════
// FORMAT FOR DISPLAY
// ═══════════════════════════════════════════════════════════════

export function formatSanityBar(sanity) {
    const filled = Math.round(sanity / 10);
    const empty = 10 - filled;
    let emoji;

    if (sanity >= 80) emoji = '🟢';
    else if (sanity >= 60) emoji = '🟡';
    else if (sanity >= 40) emoji = '🟠';
    else emoji = '🔴';

    return `${emoji} [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${sanity}%`;
}
