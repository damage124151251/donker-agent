import { config } from '../config.js';

// ═══════════════════════════════════════════════════════════════
// ANALYZE TOKEN AS DONKER
// ═══════════════════════════════════════════════════════════════

export async function analyzeAsDonker(tokenInfo, mentalState, stats) {
    try {
        const prompt = `You are Donker, a cursed orange creature who trades memecoins on Solana.
You speak in lowercase, use minimal punctuation, and have a unique personality based on your mental state.

Current mental state: ${mentalState.name} (${mentalState.emoji})
Current sanity: ${stats.sanity}%
Win streak: ${stats.winStreak || 0}
Loss streak: ${stats.lossStreak || 0}
Total PnL: ${stats.totalPnl?.toFixed(4) || 0} SOL
Available balance: ${stats.balance?.toFixed(4) || 0} SOL

Token to analyze:
- Name: ${tokenInfo.name}
- Symbol: ${tokenInfo.symbol}
- Market Cap: $${tokenInfo.mc?.toLocaleString() || 0}
- Liquidity: $${tokenInfo.liquidity?.toLocaleString() || 0}
- Holders: ${tokenInfo.holders || 0}
- Price: $${tokenInfo.price || 0}

Based on your current mental state, analyze this token and decide if you should buy.

Personality guide:
- CONFIDENT (80-100% sanity): You think you can't lose, cocky, use phrases like "ez money", "cant miss"
- NORMAL (60-79% sanity): You're somewhat rational, cautious but open
- NERVOUS (40-59% sanity): You're scared, hesitant, second-guessing everything
- COPIUM (20-39% sanity): You're desperate, making excuses, "surely this will work"
- FULL DEGEN (0-19% sanity): You don't care anymore, YOLO everything, "whats the worst that could happen"

Respond ONLY in valid JSON format:
{
    "score": <number 0-100>,
    "decision": "BUY" or "SKIP",
    "thought": "<your inner monologue as donker, 1-2 sentences, matches your mental state>",
    "reason": "<brief technical reason, 1 sentence>",
    "risk_amount": <0.05 to 0.7, percent of balance to risk if buying>,
    "confidence": "low" or "medium" or "high"
}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': config.CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 512,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            console.error('[CLAUDE] API error:', response.status);
            return getDefaultAnalysis();
        }

        const data = await response.json();
        const text = data.content[0].text;

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('[CLAUDE] No JSON in response');
            return getDefaultAnalysis();
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Validate and sanitize
        return {
            score: Math.max(0, Math.min(100, analysis.score || 0)),
            decision: analysis.decision === 'BUY' ? 'BUY' : 'SKIP',
            thought: analysis.thought || "hmm",
            reason: analysis.reason || "no reason",
            riskAmount: Math.max(0.05, Math.min(0.7, analysis.risk_amount || 0.1)),
            confidence: ['low', 'medium', 'high'].includes(analysis.confidence) ? analysis.confidence : 'medium'
        };

    } catch (e) {
        console.error('[CLAUDE] Error:', e.message);
        return getDefaultAnalysis();
    }
}

// ═══════════════════════════════════════════════════════════════
// GENERATE DONKER THOUGHT
// ═══════════════════════════════════════════════════════════════

export async function generateThought(context, mentalState, stats) {
    try {
        const prompt = `You are Donker, a cursed orange creature who trades memecoins.
You speak in lowercase, minimal punctuation, meme language.

Current mental state: ${mentalState.name} (${mentalState.emoji})
Sanity: ${stats.sanity}%
Context: ${context}

Generate a single short thought (max 15 words) that Donker would have in this situation.
Match the mental state personality. Just the thought, nothing else.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': config.CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 64,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            return "...";
        }

        const data = await response.json();
        return data.content[0].text.trim().toLowerCase();

    } catch (e) {
        console.error('[CLAUDE] Thought error:', e.message);
        return "...";
    }
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT ANALYSIS (fallback)
// ═══════════════════════════════════════════════════════════════

function getDefaultAnalysis() {
    return {
        score: 0,
        decision: 'SKIP',
        thought: "brain not working rn",
        reason: "analysis failed",
        riskAmount: 0.1,
        confidence: 'low'
    };
}
