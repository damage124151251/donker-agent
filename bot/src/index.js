import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import * as db from './lib/supabase.js';
import * as birdeye from './lib/birdeye.js';
import * as pump from './lib/pumpportal.js';
import * as brain from './lib/donker-brain.js';
import * as claude from './lib/claude.js';
import { log, formatSOL, formatUSD, shortenCA, sleep } from './lib/utils.js';

// ═══════════════════════════════════════════════════════════════
// DONKER STATE
// ═══════════════════════════════════════════════════════════════

let donkerStats = {
    balance: config.STARTING_BALANCE,
    totalPnl: 0,
    todayPnl: 0,
    totalTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    winStreak: 0,
    lossStreak: 0,
    sanity: 50,
    mentalState: 'NORMAL',
    profitToDistribute: 0,
    isOnline: false
};

let currentMentalState = brain.MENTAL_STATES.NORMAL;
let processingTokens = new Set();
let lastThoughtTime = 0;

// ═══════════════════════════════════════════════════════════════
// EXPRESS API
// ═══════════════════════════════════════════════════════════════

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        donker: donkerStats.mentalState,
        sanity: donkerStats.sanity,
        balance: donkerStats.balance,
        pnl: donkerStats.totalPnl
    });
});

app.get('/stats', (req, res) => {
    res.json(donkerStats);
});

app.listen(config.PORT, () => {
    log(`API rodando na porta ${config.PORT}`, 'success');
});

// ═══════════════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════════════

async function startup() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                     DONKER AGENT                          ║');
    console.log('║               cursed memecoin trading                     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n');

    // Load wallet
    const wallet = pump.loadWallet();
    if (wallet) {
        const balance = await pump.getWalletBalance();
        donkerStats.balance = balance;
        log(`Wallet balance: ${formatSOL(balance)} SOL`, 'success');
    }

    // Load stats from database
    const savedStats = await db.getSystemStatus();
    if (savedStats) {
        donkerStats = {
            ...donkerStats,
            totalPnl: parseFloat(savedStats.total_pnl) || 0,
            todayPnl: parseFloat(savedStats.today_pnl) || 0,
            totalTrades: savedStats.total_trades || 0,
            wins: savedStats.wins || 0,
            losses: savedStats.losses || 0,
            winRate: parseFloat(savedStats.win_rate) || 0,
            winStreak: savedStats.win_streak || 0,
            lossStreak: savedStats.loss_streak || 0,
            sanity: savedStats.sanity || 50,
            profitToDistribute: parseFloat(savedStats.profit_to_distribute) || 0
        };
    }

    // Calculate initial sanity and mental state
    donkerStats.sanity = brain.calculateSanity(donkerStats);
    currentMentalState = brain.getMentalState(donkerStats.sanity);
    donkerStats.mentalState = brain.getMentalStateName(donkerStats.sanity);

    log(`Mental State: ${currentMentalState.name} ${currentMentalState.emoji}`, 'brain');
    log(brain.formatSanityBar(donkerStats.sanity), 'brain');

    // Update database
    donkerStats.isOnline = true;
    await updateStatus();

    // Add startup thought
    const startupReaction = brain.getReaction('onStartup', currentMentalState);
    await db.addThought(startupReaction, 'startup', null, donkerStats.mentalState, donkerStats.sanity);
    log(`"${startupReaction}"`, 'donker');

    // Connect to PumpPortal
    pump.connectPumpPortal({
        onConnect: () => {
            pump.subscribeNewTokens();
            log('Listening for new tokens...', 'success');
        },
        onDisconnect: () => {
            log('WebSocket disconnected', 'warning');
        },
        onToken: handleNewToken,
        onTrade: handleTrade
    });

    // Start position monitoring
    setInterval(checkPositions, config.POSITION_CHECK_INTERVAL);

    // Periodic sanity update
    setInterval(updateSanityAndState, 60000);

    // Fee claiming (if DONK token configured)
    if (config.DONK_TOKEN_CA) {
        setInterval(() => claimGoobFees(), config.FEE_CLAIM_INTERVAL);
    }
}

// ═══════════════════════════════════════════════════════════════
// HANDLE NEW TOKEN
// ═══════════════════════════════════════════════════════════════

async function handleNewToken(msg) {
    const ca = msg.mint;

    // Skip if already processing
    if (processingTokens.has(ca)) return;
    processingTokens.add(ca);

    try {
        // Initial reaction
        const newTokenReaction = brain.getReaction('onNewToken', currentMentalState);
        log(`New token: ${shortenCA(ca)} - "${newTokenReaction}"`, 'donker');

        // Wait a bit for data to populate
        await sleep(3000);

        // Get token info from Birdeye
        const tokenInfo = await birdeye.getTokenInfo(ca);
        if (!tokenInfo) {
            log(`Could not get info for ${shortenCA(ca)}`, 'warning');
            processingTokens.delete(ca);
            return;
        }

        log(`${tokenInfo.symbol} - MC: ${formatUSD(tokenInfo.mc)} | Liq: ${formatUSD(tokenInfo.liquidity)} | Holders: ${tokenInfo.holders}`, 'info');

        // Save token to database
        await db.upsertToken({
            ca,
            nome: tokenInfo.name,
            simbolo: tokenInfo.symbol,
            logo: tokenInfo.logo,
            market_cap: tokenInfo.mc,
            preco: tokenInfo.price,
            holders: tokenInfo.holders,
            liquidity: tokenInfo.liquidity,
            status: 'analyzing'
        });

        // Basic filters
        if (tokenInfo.mc < 5000 || tokenInfo.mc > 500000) {
            log(`${tokenInfo.symbol} - MC out of range, skipping`, 'info');
            processingTokens.delete(ca);
            return;
        }

        if (tokenInfo.liquidity < 1000) {
            log(`${tokenInfo.symbol} - Low liquidity, skipping`, 'info');
            processingTokens.delete(ca);
            return;
        }

        // Analyze with Claude as Donker
        log(`Analyzing ${tokenInfo.symbol} with Donker brain...`, 'brain');
        const analysis = await claude.analyzeAsDonker(tokenInfo, currentMentalState, donkerStats);

        log(`Score: ${analysis.score} | Decision: ${analysis.decision} | Confidence: ${analysis.confidence}`, 'brain');
        log(`Donker thinks: "${analysis.thought}"`, 'donker');

        // Update token with analysis
        await db.updateToken(ca, {
            donker_score: analysis.score,
            donker_decision: analysis.decision,
            donker_thought: analysis.thought,
            donker_confidence: analysis.confidence,
            status: analysis.decision === 'BUY' ? 'buying' : 'skipped'
        });

        // Add thought to feed
        await db.addThought(analysis.thought, 'analysis', ca, donkerStats.mentalState, donkerStats.sanity);

        // Decision logic
        const tradeParams = brain.getTradeParams(donkerStats.balance, currentMentalState, config);

        if (analysis.decision === 'BUY' && brain.shouldTrade(analysis.score, currentMentalState, analysis.confidence)) {
            // Calculate trade amount
            const tradeAmount = Math.min(
                donkerStats.balance * analysis.riskAmount,
                tradeParams.maxTradeAmount,
                donkerStats.balance * 0.7 // Never more than 70%
            );

            if (tradeAmount >= 0.01) {
                await executeBuy(ca, tokenInfo, tradeAmount, analysis, tradeParams);
            } else {
                log('Balance too low for trade', 'warning');
            }
        } else {
            const skipReaction = brain.getReaction('onSkip', currentMentalState);
            log(`Skipping ${tokenInfo.symbol} - "${skipReaction}"`, 'donker');
            await db.addThought(skipReaction, 'skip', ca, donkerStats.mentalState, donkerStats.sanity);
        }

    } catch (e) {
        log(`Error processing token: ${e.message}`, 'error');
    } finally {
        processingTokens.delete(ca);
    }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE BUY
// ═══════════════════════════════════════════════════════════════

async function executeBuy(ca, tokenInfo, amount, analysis, tradeParams) {
    const buyReaction = brain.getReaction('onBuy', currentMentalState);
    log(`Buying ${formatSOL(amount)} SOL of ${tokenInfo.symbol} - "${buyReaction}"`, 'trade');

    await db.addThought(buyReaction, 'buy', ca, donkerStats.mentalState, donkerStats.sanity);

    // Execute trade
    const txSignature = await pump.buyToken(ca, amount);

    if (!txSignature) {
        log('Buy failed!', 'error');
        await db.updateToken(ca, { status: 'buy_failed' });
        return;
    }

    log(`Buy TX: ${txSignature}`, 'success');

    // Record trade
    await db.recordTrade({
        token_id: ca,
        tipo: 'buy',
        valor_sol: amount,
        preco: tokenInfo.price,
        donker_reaction: buyReaction,
        mental_state_at_trade: donkerStats.mentalState,
        sanity_at_trade: donkerStats.sanity,
        tx_signature: txSignature
    });

    // Create position
    await db.createPosition({
        token_id: ca,
        valor_sol: amount,
        entry_price: tokenInfo.price,
        current_price: tokenInfo.price,
        stop_loss: tradeParams.stopLoss,
        take_profit: tradeParams.takeProfit,
        mental_state_at_entry: donkerStats.mentalState
    });

    await db.updateToken(ca, { status: 'holding' });

    // Update balance
    donkerStats.balance -= amount;
    donkerStats.totalTrades++;
    await updateStatus();
}

// ═══════════════════════════════════════════════════════════════
// CHECK POSITIONS
// ═══════════════════════════════════════════════════════════════

async function checkPositions() {
    const positions = await db.getOpenPositions();

    for (const pos of positions) {
        try {
            const tokenInfo = await birdeye.getTokenInfo(pos.token_id);
            if (!tokenInfo) continue;

            const entryPrice = parseFloat(pos.entry_price);
            const currentPrice = tokenInfo.price;
            const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
            const pnlSol = parseFloat(pos.valor_sol) * (pnlPercent / 100);

            // Update position
            await db.updatePosition(pos.id, {
                current_price: currentPrice,
                pnl_percent: pnlPercent,
                pnl_sol: pnlSol
            });

            // Check stop loss / take profit
            const shouldSell = (
                pnlPercent <= pos.stop_loss ||
                pnlPercent >= pos.take_profit
            );

            if (shouldSell) {
                await executeSell(pos, tokenInfo, pnlPercent, pnlSol);
            }

        } catch (e) {
            log(`Error checking position: ${e.message}`, 'error');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE SELL
// ═══════════════════════════════════════════════════════════════

async function executeSell(position, tokenInfo, pnlPercent, pnlSol) {
    const isProfit = pnlSol > 0;
    let reaction;

    if (isProfit) {
        if (pnlPercent > 50) {
            reaction = brain.getReaction('onProfit', currentMentalState);
        } else {
            reaction = brain.getReaction('onSmallProfit', currentMentalState);
        }
    } else {
        if (pnlPercent < -30) {
            reaction = brain.getReaction('onBigLoss', currentMentalState);
        } else {
            reaction = brain.getReaction('onLoss', currentMentalState);
        }
    }

    log(`Selling ${tokenInfo.symbol} | PnL: ${pnlPercent.toFixed(2)}% (${formatSOL(pnlSol)} SOL) - "${reaction}"`, 'trade');

    await db.addThought(reaction, isProfit ? 'profit' : 'loss', position.token_id, donkerStats.mentalState, donkerStats.sanity);

    // Execute sell
    const txSignature = await pump.sellToken(position.token_id, 100);

    if (!txSignature) {
        log('Sell failed!', 'error');
        return;
    }

    log(`Sell TX: ${txSignature}`, 'success');

    // Record trade
    await db.recordTrade({
        token_id: position.token_id,
        tipo: 'sell',
        valor_sol: parseFloat(position.valor_sol) + pnlSol,
        preco: tokenInfo.price,
        pnl_sol: pnlSol,
        pnl_percent: pnlPercent,
        donker_reaction: reaction,
        mental_state_at_trade: donkerStats.mentalState,
        sanity_at_trade: donkerStats.sanity,
        tx_signature: txSignature
    });

    // Close position
    await db.closePosition(position.id, pnlSol, pnlPercent);
    await db.updateToken(position.token_id, { status: 'closed' });

    // Update stats
    donkerStats.balance += parseFloat(position.valor_sol) + pnlSol;
    donkerStats.totalPnl += pnlSol;
    donkerStats.todayPnl += pnlSol;

    if (isProfit) {
        donkerStats.wins++;
        donkerStats.winStreak++;
        donkerStats.lossStreak = 0;
        donkerStats.profitToDistribute += pnlSol;

        if (donkerStats.winStreak >= 3) {
            const streakReaction = brain.getReaction('onWinStreak', currentMentalState);
            await db.addThought(streakReaction, 'streak', null, donkerStats.mentalState, donkerStats.sanity);
        }
    } else {
        donkerStats.losses++;
        donkerStats.lossStreak++;
        donkerStats.winStreak = 0;

        if (donkerStats.lossStreak >= 3) {
            const streakReaction = brain.getReaction('onLossStreak', currentMentalState);
            await db.addThought(streakReaction, 'streak', null, donkerStats.mentalState, donkerStats.sanity);
        }
    }

    donkerStats.winRate = (donkerStats.wins / donkerStats.totalTrades) * 100;

    // Update sanity based on result
    updateSanityAndState();
    await updateStatus();

    // Check if we should distribute
    if (donkerStats.profitToDistribute >= config.PROFIT_DISTRIBUTION_TARGET) {
        await distributeToHolders();
    }
}

// ═══════════════════════════════════════════════════════════════
// DISTRIBUTE TO HOLDERS
// ═══════════════════════════════════════════════════════════════

async function distributeToHolders() {
    const amount = donkerStats.profitToDistribute;
    log(`Distributing ${formatSOL(amount)} SOL to holders!`, 'success');

    const reaction = brain.getReaction('onDistribute', currentMentalState);
    await db.addThought(reaction, 'distribute', null, donkerStats.mentalState, donkerStats.sanity);

    // TODO: Implement actual distribution logic
    // This would involve getting $DONK holders and sending SOL

    await db.recordDistribution(amount, null, 0);

    donkerStats.profitToDistribute = 0;
    await updateStatus();
}

// ═══════════════════════════════════════════════════════════════
// CLAIM DONK FEES
// ═══════════════════════════════════════════════════════════════

async function claimGoobFees() {
    if (!config.DONK_TOKEN_CA) return;

    log('Claiming DONK fees...', 'info');
    const tx = await pump.claimFees(config.DONK_TOKEN_CA);

    if (tx) {
        log(`Fees claimed: ${tx}`, 'success');
    }
}

// ═══════════════════════════════════════════════════════════════
// UPDATE SANITY AND STATE
// ═══════════════════════════════════════════════════════════════

function updateSanityAndState() {
    const oldSanity = donkerStats.sanity;
    const oldState = donkerStats.mentalState;

    donkerStats.sanity = brain.calculateSanity(donkerStats);
    currentMentalState = brain.getMentalState(donkerStats.sanity);
    donkerStats.mentalState = brain.getMentalStateName(donkerStats.sanity);

    if (oldState !== donkerStats.mentalState) {
        log(`Mental state changed: ${oldState} → ${donkerStats.mentalState} ${currentMentalState.emoji}`, 'brain');
        log(brain.formatSanityBar(donkerStats.sanity), 'brain');
    }
}

// ═══════════════════════════════════════════════════════════════
// HANDLE EXTERNAL TRADE (from WebSocket)
// ═══════════════════════════════════════════════════════════════

async function handleTrade(msg) {
    // Handle trades from monitored accounts if needed
}

// ═══════════════════════════════════════════════════════════════
// UPDATE STATUS
// ═══════════════════════════════════════════════════════════════

async function updateStatus() {
    const wallet = pump.getWallet();

    await db.updateSystemStatus({
        status: donkerStats.isOnline ? 'ONLINE' : 'OFFLINE',
        wallet_address: wallet?.publicKey.toBase58() || null,
        balance_sol: donkerStats.balance,
        total_pnl: donkerStats.totalPnl,
        today_pnl: donkerStats.todayPnl,
        total_trades: donkerStats.totalTrades,
        wins: donkerStats.wins,
        losses: donkerStats.losses,
        win_rate: donkerStats.winRate,
        win_streak: donkerStats.winStreak,
        loss_streak: donkerStats.lossStreak,
        sanity: donkerStats.sanity,
        mental_state: donkerStats.mentalState,
        profit_to_distribute: donkerStats.profitToDistribute
    });
}

// ═══════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════

startup().catch(e => {
    log(`Startup error: ${e.message}`, 'error');
    process.exit(1);
});
