import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase credentials (public - anon key is meant to be exposed)
const SUPABASE_URL = 'https://mwhgynorxpyqkwjwzlnr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aGd5bm9yeHB5cWt3and6bG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDE2ODksImV4cCI6MjA4MzY3NzY4OX0.obAlu8QSskeEcAHmywY57iNErgZNq1jSeaB3femGyuI';

// Create Supabase client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getSupabase(): SupabaseClient {
    return supabase;
}

// Types
export interface SystemStatus {
    id: number;
    status: string;
    wallet_address: string | null;
    balance_sol: number;
    total_pnl: number;
    today_pnl: number;
    total_trades: number;
    wins: number;
    losses: number;
    win_rate: number;
    win_streak: number;
    loss_streak: number;
    sanity: number;
    mental_state: string;
    profit_to_distribute: number;
    updated_at: string;
}

export interface Token {
    id: string;
    ca: string;
    nome: string;
    simbolo: string;
    logo: string | null;
    market_cap: number;
    preco: number;
    holders: number;
    liquidity: number;
    donker_score: number;
    donker_decision: string;
    donker_thought: string;
    donker_confidence: string;
    status: string;
    criado_em: string;
}

export interface Trade {
    id: string;
    token_id: string;
    tipo: string;
    valor_sol: number;
    preco: number;
    pnl_sol: number | null;
    pnl_percent: number | null;
    donker_reaction: string;
    mental_state_at_trade: string;
    sanity_at_trade: number;
    tx_signature: string;
    data: string;
    tokens?: Token;
}

export interface Position {
    id: string;
    token_id: string;
    status: string;
    valor_sol: number;
    entry_price: number;
    current_price: number;
    pnl_percent: number;
    pnl_sol: number;
    stop_loss: number;
    take_profit: number;
    mental_state_at_entry: string;
    aberto_em: string;
    tokens?: Token;
}

export interface DonkerThought {
    id: string;
    thought: string;
    type: string;
    related_token: string | null;
    mental_state: string;
    sanity: number;
    created_at: string;
}

// Fetch functions
export async function getSystemStatus(): Promise<SystemStatus | null> {
    try {
        const { data, error } = await supabase
            .from('system_status')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching system status:', error);
            return null;
        }
        return data;
    } catch (e) {
        console.error('Exception fetching system status:', e);
        return null;
    }
}

export async function getThoughts(limit = 20): Promise<DonkerThought[]> {
    try {
        const { data, error } = await supabase
            .from('donker_thoughts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching thoughts:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Exception fetching thoughts:', e);
        return [];
    }
}

export async function getTrades(limit = 20): Promise<Trade[]> {
    try {
        const { data, error } = await supabase
            .from('trades')
            .select('*, tokens(nome, simbolo, logo)')
            .order('data', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching trades:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Exception fetching trades:', e);
        return [];
    }
}

export async function getOpenPositions(): Promise<Position[]> {
    try {
        const { data, error } = await supabase
            .from('positions')
            .select('*, tokens(nome, simbolo, logo)')
            .eq('status', 'open');

        if (error) {
            console.error('Error fetching positions:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Exception fetching positions:', e);
        return [];
    }
}

export async function getRecentTokens(limit = 10): Promise<Token[]> {
    try {
        const { data, error } = await supabase
            .from('tokens')
            .select('*')
            .order('criado_em', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching tokens:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Exception fetching tokens:', e);
        return [];
    }
}
