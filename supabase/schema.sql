-- ═══════════════════════════════════════════════════════════════
-- GOOBER AGENT - DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════

-- System Status (includes sanity and mental state)
CREATE TABLE IF NOT EXISTS system_status (
    id INT PRIMARY KEY DEFAULT 1,
    status TEXT DEFAULT 'OFFLINE',
    wallet_address TEXT,
    balance_sol DECIMAL(20, 9) DEFAULT 0.5,
    starting_balance DECIMAL(20, 9) DEFAULT 0.5,
    total_pnl DECIMAL(20, 9) DEFAULT 0,
    today_pnl DECIMAL(20, 9) DEFAULT 0,
    total_trades INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    win_rate DECIMAL(5, 2) DEFAULT 0,
    win_streak INT DEFAULT 0,
    loss_streak INT DEFAULT 0,
    sanity INT DEFAULT 50,
    mental_state TEXT DEFAULT 'NORMAL',
    profit_to_distribute DECIMAL(20, 9) DEFAULT 0,
    total_distributed DECIMAL(20, 9) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial row
INSERT INTO system_status (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Tokens analyzed
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ca TEXT UNIQUE NOT NULL,
    nome TEXT,
    simbolo TEXT,
    logo TEXT,
    market_cap DECIMAL(20, 2),
    preco DECIMAL(30, 18),
    holders INT,
    liquidity DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    goober_score INT,
    goober_decision TEXT,
    goober_thought TEXT,
    goober_confidence TEXT,
    status TEXT DEFAULT 'analyzing',
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Trades with reactions
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id TEXT REFERENCES tokens(ca),
    tipo TEXT NOT NULL,
    valor_sol DECIMAL(20, 9),
    preco DECIMAL(30, 18),
    pnl_sol DECIMAL(20, 9),
    pnl_percent DECIMAL(10, 2),
    goober_reaction TEXT,
    mental_state_at_trade TEXT,
    sanity_at_trade INT,
    tx_signature TEXT,
    data TIMESTAMPTZ DEFAULT NOW()
);

-- Positions
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id TEXT REFERENCES tokens(ca),
    status TEXT DEFAULT 'open',
    valor_sol DECIMAL(20, 9),
    entry_price DECIMAL(30, 18),
    current_price DECIMAL(30, 18),
    pnl_percent DECIMAL(10, 2),
    pnl_sol DECIMAL(20, 9),
    stop_loss DECIMAL(10, 2),
    take_profit DECIMAL(10, 2),
    mental_state_at_entry TEXT,
    aberto_em TIMESTAMPTZ DEFAULT NOW(),
    fechado_em TIMESTAMPTZ
);

-- Goober Thoughts (activity feed)
CREATE TABLE IF NOT EXISTS goober_thoughts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thought TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    related_token TEXT,
    mental_state TEXT,
    sanity INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distributions (profit sharing history)
CREATE TABLE IF NOT EXISTS distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount_sol DECIMAL(20, 9),
    tx_signature TEXT,
    holders_count INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_tokens_ca ON tokens(ca);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_tokens_criado_em ON tokens(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_trades_data ON trades(data DESC);
CREATE INDEX IF NOT EXISTS idx_trades_token_id ON trades(token_id);
CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
CREATE INDEX IF NOT EXISTS idx_positions_token_id ON positions(token_id);
CREATE INDEX IF NOT EXISTS idx_goober_thoughts_created_at ON goober_thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_distributions_created_at ON distributions(created_at DESC);
