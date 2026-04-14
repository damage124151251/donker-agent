import 'dotenv/config';

export const config = {
    // PumpPortal
    PUMPPORTAL_WS: 'wss://pumpportal.fun/api/data',
    PUMPPORTAL_TRADE: 'https://pumpportal.fun/api/trade-local',

    // Birdeye (do .env)
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    BIRDEYE_META: 'https://public-api.birdeye.so/defi/v3/token/meta-data/multiple',
    BIRDEYE_MARKET: 'https://public-api.birdeye.so/defi/v3/token/market-data/multiple',
    BIRDEYE_PRICE: 'https://public-api.birdeye.so/defi/price',

    // Helius (do .env)
    HELIUS_RPC: process.env.HELIUS_RPC,

    // Claude (do .env)
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,

    // Supabase (do .env)
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

    // Wallet (do .env)
    WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,

    // DONK Token (do .env)
    DONK_TOKEN_CA: process.env.DONK_TOKEN_CA,

    // Server
    PORT: parseInt(process.env.PORT) || 3001,

    // Trading Config
    STARTING_BALANCE: 0.5,
    MAX_TRADE_PERCENT: 0.7,
    PROFIT_DISTRIBUTION_TARGET: 1.0,
    BASE_STOP_LOSS: -20,
    BASE_TAKE_PROFIT: 40,
    POSITION_CHECK_INTERVAL: 30000,
    FEE_CLAIM_INTERVAL: 300000,
    SLIPPAGE: 15
};

// Validação
const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'BIRDEYE_API_KEY', 'HELIUS_RPC', 'CLAUDE_API_KEY'];
const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
    console.error('❌ Missing required env vars:', missing.join(', '));
    process.exit(1);
}

console.log('✅ Config loaded successfully');
