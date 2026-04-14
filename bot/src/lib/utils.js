// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatSOL(amount) {
    if (amount === null || amount === undefined) return '0.0000';
    return parseFloat(amount).toFixed(4);
}

export function formatUSD(amount) {
    if (amount === null || amount === undefined) return '$0.00';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
}

export function formatPercent(value) {
    if (value === null || value === undefined) return '0.00%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

export function shortenAddress(address, chars = 4) {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function shortenCA(ca) {
    if (!ca) return '';
    return `${ca.slice(0, 6)}...${ca.slice(-4)}`;
}

export function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

export function calculatePnL(entryPrice, currentPrice, amount) {
    if (!entryPrice || !currentPrice) return { percent: 0, sol: 0 };
    const percent = ((currentPrice - entryPrice) / entryPrice) * 100;
    const sol = amount * (percent / 100);
    return { percent, sol };
}

export function isValidCA(ca) {
    if (!ca) return false;
    // Solana address is base58, 32-44 chars
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(ca);
}

export function randomDelay(minMs, maxMs) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return sleep(delay);
}

// ═══════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════

const LOG_COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    orange: '\x1b[38;5;208m'
};

export function log(message, type = 'info') {
    const timestamp = getTimestamp();
    let color = LOG_COLORS.reset;
    let prefix = '[INFO]';

    switch (type) {
        case 'success':
            color = LOG_COLORS.green;
            prefix = '[SUCCESS]';
            break;
        case 'error':
            color = LOG_COLORS.red;
            prefix = '[ERROR]';
            break;
        case 'warning':
            color = LOG_COLORS.yellow;
            prefix = '[WARNING]';
            break;
        case 'donker':
            color = LOG_COLORS.orange;
            prefix = '[DONKER]';
            break;
        case 'trade':
            color = LOG_COLORS.cyan;
            prefix = '[TRADE]';
            break;
        case 'brain':
            color = LOG_COLORS.magenta;
            prefix = '[BRAIN]';
            break;
    }

    console.log(`${color}${timestamp} ${prefix} ${message}${LOG_COLORS.reset}`);
}

// ═══════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════

const rateLimiters = new Map();

export function isRateLimited(key, limitMs) {
    const now = Date.now();
    const lastTime = rateLimiters.get(key) || 0;

    if (now - lastTime < limitMs) {
        return true;
    }

    rateLimiters.set(key, now);
    return false;
}

// ═══════════════════════════════════════════════════════════════
// SIMPLE CACHE
// ═══════════════════════════════════════════════════════════════

const cache = new Map();

export function setCache(key, value, ttlMs = 60000) {
    cache.set(key, {
        value,
        expiry: Date.now() + ttlMs
    });
}

export function getCache(key) {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }

    return item.value;
}

export function clearCache() {
    cache.clear();
}
