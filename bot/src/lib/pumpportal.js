import WebSocket from 'ws';
import { Keypair, Connection, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { config } from '../config.js';

const connection = new Connection(config.HELIUS_RPC);
let wallet = null;
let ws = null;
let isConnected = false;

// ═══════════════════════════════════════════════════════════════
// WALLET
// ═══════════════════════════════════════════════════════════════

export function loadWallet() {
    try {
        if (!config.WALLET_PRIVATE_KEY) {
            console.log('[WALLET] Nenhuma wallet configurada - modo somente leitura');
            return null;
        }

        const pk = config.WALLET_PRIVATE_KEY.trim();
        let secretKey;

        if (pk.startsWith('[')) {
            secretKey = new Uint8Array(JSON.parse(pk));
        } else {
            secretKey = new Uint8Array(Buffer.from(pk, 'base64'));
        }

        wallet = Keypair.fromSecretKey(secretKey);
        console.log('[WALLET] Carregada:', wallet.publicKey.toBase58());
        return wallet;
    } catch (e) {
        console.error('[WALLET] Erro ao carregar:', e.message);
        return null;
    }
}

export function getWallet() {
    return wallet;
}

export async function getWalletBalance() {
    if (!wallet) return 0;
    try {
        const balance = await connection.getBalance(wallet.publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (e) {
        console.error('[WALLET] Erro ao obter balance:', e.message);
        return 0;
    }
}

// ═══════════════════════════════════════════════════════════════
// WEBSOCKET
// ═══════════════════════════════════════════════════════════════

export function connectPumpPortal(callbacks = {}) {
    const { onConnect, onDisconnect, onToken, onTrade } = callbacks;

    ws = new WebSocket(config.PUMPPORTAL_WS);

    ws.on('open', () => {
        isConnected = true;
        console.log('[PUMPPORTAL] Conectado!');
        if (onConnect) onConnect();
    });

    ws.on('message', async (data) => {
        try {
            const msg = JSON.parse(data.toString());

            if (msg.txType === 'create' && msg.mint && onToken) {
                onToken(msg);
            }

            if ((msg.txType === 'buy' || msg.txType === 'sell') && onTrade) {
                onTrade(msg);
            }
        } catch {}
    });

    ws.on('close', () => {
        isConnected = false;
        console.log('[PUMPPORTAL] Desconectado. Reconectando em 5s...');
        if (onDisconnect) onDisconnect();
        setTimeout(() => connectPumpPortal(callbacks), 5000);
    });

    ws.on('error', (e) => console.error('[PUMPPORTAL] Erro:', e.message));

    return ws;
}

export function isWebSocketConnected() {
    return isConnected;
}

export function subscribeNewTokens() {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
        console.log('[PUMPPORTAL] Inscrito em novos tokens');
    }
}

export function subscribeAccount(walletAddress) {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeAccountTrade', keys: [walletAddress] }));
        console.log('[PUMPPORTAL] Inscrito em trades da carteira:', walletAddress);
    }
}

export function subscribeToken(tokenMint) {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeTokenTrade', keys: [tokenMint] }));
        console.log('[PUMPPORTAL] Inscrito em trades do token:', tokenMint);
    }
}

// ═══════════════════════════════════════════════════════════════
// TRADING
// ═══════════════════════════════════════════════════════════════

export async function buyToken(ca, amountSol, slippage = config.SLIPPAGE) {
    if (!wallet) {
        console.error('[BUY] Wallet nao configurada');
        return null;
    }

    try {
        console.log(`[BUY] Comprando ${amountSol} SOL de ${ca}`);

        const response = await fetch(config.PUMPPORTAL_TRADE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: wallet.publicKey.toBase58(),
                action: 'buy',
                mint: ca,
                amount: amountSol * LAMPORTS_PER_SOL,
                denominatedInSol: 'true',
                slippage,
                priorityFee: 0.0005,
                pool: 'pump'
            })
        });

        if (response.status !== 200) {
            console.error('[BUY] Erro:', await response.text());
            return null;
        }

        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([wallet]);

        const signature = await connection.sendTransaction(tx);
        console.log('[BUY] TX:', signature);

        return signature;
    } catch (e) {
        console.error('[BUY] Erro:', e.message);
        return null;
    }
}

export async function sellToken(ca, percentOrAmount = 100, slippage = config.SLIPPAGE) {
    if (!wallet) {
        console.error('[SELL] Wallet nao configurada');
        return null;
    }

    try {
        const amount = percentOrAmount === 100 ? 'all' : `${percentOrAmount}%`;
        console.log(`[SELL] Vendendo ${amount} de ${ca}`);

        const response = await fetch(config.PUMPPORTAL_TRADE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: wallet.publicKey.toBase58(),
                action: 'sell',
                mint: ca,
                amount,
                denominatedInSol: 'false',
                slippage,
                priorityFee: 0.0005,
                pool: 'pump'
            })
        });

        if (response.status !== 200) {
            console.error('[SELL] Erro:', await response.text());
            return null;
        }

        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([wallet]);

        const signature = await connection.sendTransaction(tx);
        console.log('[SELL] TX:', signature);

        return signature;
    } catch (e) {
        console.error('[SELL] Erro:', e.message);
        return null;
    }
}

export async function claimFees(ca) {
    if (!wallet) {
        console.error('[CLAIM] Wallet nao configurada');
        return null;
    }

    try {
        console.log(`[CLAIM] Resgatando fees de ${ca}`);

        const response = await fetch('https://pumpportal.fun/api/claim-fees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: wallet.publicKey.toBase58(),
                mint: ca
            })
        });

        if (response.status !== 200) {
            const text = await response.text();
            if (text.includes('No fees')) {
                console.log('[CLAIM] Sem fees para resgatar');
                return null;
            }
            console.error('[CLAIM] Erro:', text);
            return null;
        }

        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([wallet]);

        const signature = await connection.sendTransaction(tx);
        console.log('[CLAIM] TX:', signature);

        return signature;
    } catch (e) {
        console.error('[CLAIM] Erro:', e.message);
        return null;
    }
}
