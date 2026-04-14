import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_KEY || config.SUPABASE_ANON_KEY
);

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export async function getSystemStatus() {
    const { data } = await supabase
        .from('system_status')
        .select('*')
        .eq('id', 1)
        .single();
    return data;
}

export async function updateSystemStatus(updates) {
    const { error } = await supabase
        .from('system_status')
        .upsert({ id: 1, ...updates, updated_at: new Date().toISOString() });
    if (error) console.error('[SUPABASE] Status error:', error.message);
    return !error;
}

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════

export async function upsertToken(token) {
    const { data, error } = await supabase
        .from('tokens')
        .upsert({ ...token, atualizado_em: new Date().toISOString() }, { onConflict: 'ca' })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Token error:', error.message);
    return data;
}

export async function getToken(ca) {
    const { data } = await supabase.from('tokens').select('*').eq('ca', ca).single();
    return data;
}

export async function updateToken(ca, updates) {
    const { data, error } = await supabase
        .from('tokens')
        .update({ ...updates, atualizado_em: new Date().toISOString() })
        .eq('ca', ca)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Token update error:', error.message);
    return data;
}

// ═══════════════════════════════════════════════════════════════
// TRADES
// ═══════════════════════════════════════════════════════════════

export async function recordTrade(trade) {
    const { data, error } = await supabase.from('trades').insert(trade).select().single();
    if (error) console.error('[SUPABASE] Trade error:', error.message);
    return data;
}

export async function getTrades(limit = 50) {
    const { data } = await supabase
        .from('trades')
        .select('*, tokens(nome, simbolo, logo)')
        .order('data', { ascending: false })
        .limit(limit);
    return data || [];
}

// ═══════════════════════════════════════════════════════════════
// POSITIONS
// ═══════════════════════════════════════════════════════════════

export async function createPosition(position) {
    const { data, error } = await supabase.from('positions').insert(position).select().single();
    if (error) console.error('[SUPABASE] Position error:', error.message);
    return data;
}

export async function getOpenPositions() {
    const { data } = await supabase
        .from('positions')
        .select('*, tokens(nome, simbolo, logo, preco)')
        .eq('status', 'open');
    return data || [];
}

export async function updatePosition(id, updates) {
    const { data, error } = await supabase
        .from('positions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Position update error:', error.message);
    return data;
}

export async function closePosition(id, pnlSol, pnlPercent) {
    const { data, error } = await supabase
        .from('positions')
        .update({
            status: 'closed',
            pnl_sol: pnlSol,
            pnl_percent: pnlPercent,
            fechado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Close error:', error.message);
    return data;
}

// ═══════════════════════════════════════════════════════════════
// DONKER THOUGHTS
// ═══════════════════════════════════════════════════════════════

export async function addThought(thought, type = 'general', relatedToken = null, mentalState = null, sanity = null) {
    const { data, error } = await supabase
        .from('donker_thoughts')
        .insert({
            thought,
            type,
            related_token: relatedToken,
            mental_state: mentalState,
            sanity
        })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Thought error:', error.message);
    return data;
}

export async function getThoughts(limit = 20) {
    const { data } = await supabase
        .from('donker_thoughts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
}

// ═══════════════════════════════════════════════════════════════
// DISTRIBUTIONS
// ═══════════════════════════════════════════════════════════════

export async function recordDistribution(amountSol, txSignature, holdersCount) {
    const { data, error } = await supabase
        .from('distributions')
        .insert({ amount_sol: amountSol, tx_signature: txSignature, holders_count: holdersCount })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Distribution error:', error.message);
    return data;
}

export async function getDistributions() {
    const { data } = await supabase
        .from('distributions')
        .select('*')
        .order('created_at', { ascending: false });
    return data || [];
}
