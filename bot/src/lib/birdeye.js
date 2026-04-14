import { config } from '../config.js';

const HEADERS = {
    'X-API-KEY': config.BIRDEYE_API_KEY,
    'x-chain': 'solana'
};

let solPriceUsd = 0;
let solPriceLastUpdate = 0;

// ═══════════════════════════════════════════════════════════════
// SOL PRICE (cached)
// ═══════════════════════════════════════════════════════════════

export async function getSolPrice() {
    const now = Date.now();
    if (solPriceUsd > 0 && now - solPriceLastUpdate < 60000) return solPriceUsd;

    try {
        const r = await fetch(
            `${config.BIRDEYE_PRICE}?address=So11111111111111111111111111111111111111112`,
            { headers: HEADERS }
        );
        const json = await r.json();
        if (json.success && json.data?.value) {
            solPriceUsd = json.data.value;
            solPriceLastUpdate = now;
        }
    } catch (e) {
        console.error('[BIRDEYE] SOL price error:', e.message);
    }

    return solPriceUsd > 0 ? solPriceUsd : 200;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN METADATA
// ═══════════════════════════════════════════════════════════════

export async function getTokenMetadata(ca) {
    try {
        const r = await fetch(
            `${config.BIRDEYE_META}?list_address=${ca}`,
            { headers: HEADERS }
        );
        const json = await r.json();

        if (json.success && json.data?.[ca]) {
            const d = json.data[ca];
            return {
                name: d.name,
                symbol: d.symbol,
                logo: d.logo_uri,
                decimals: d.decimals
            };
        }
    } catch (e) {
        console.error('[BIRDEYE] Metadata error:', e.message);
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN MARKET DATA
// ═══════════════════════════════════════════════════════════════

export async function getTokenMarket(ca) {
    try {
        const r = await fetch(
            `${config.BIRDEYE_MARKET}?list_address=${ca}`,
            { headers: HEADERS }
        );
        const json = await r.json();

        if (json.success && json.data?.[ca]) {
            const d = json.data[ca];
            return {
                price: d.price || 0,
                mc: d.marketCap || d.realMc || 0,
                liquidity: d.liquidity || 0,
                volume24h: d.v24hUSD || 0,
                holders: d.holder || 0
            };
        }
    } catch (e) {
        console.error('[BIRDEYE] Market error:', e.message);
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════
// COMBINED TOKEN INFO
// ═══════════════════════════════════════════════════════════════

export async function getTokenInfo(ca) {
    const [metadata, market] = await Promise.all([
        getTokenMetadata(ca),
        getTokenMarket(ca)
    ]);

    if (!metadata && !market) return null;

    return {
        name: metadata?.name || 'Unknown',
        symbol: metadata?.symbol || '???',
        logo: metadata?.logo || null,
        decimals: metadata?.decimals || 9,
        price: market?.price || 0,
        mc: market?.mc || 0,
        liquidity: market?.liquidity || 0,
        volume24h: market?.volume24h || 0,
        holders: market?.holders || 0
    };
}

// ═══════════════════════════════════════════════════════════════
// IPFS IMAGE FETCH
// ═══════════════════════════════════════════════════════════════

export async function fetchImageFromIPFS(metadataUri) {
    if (!metadataUri) return null;

    try {
        let url = metadataUri;
        const ipfsMatch = metadataUri.match(/ipfs[./]+(Qm[a-zA-Z0-9]+|bafk[a-zA-Z0-9]+)/i);
        if (ipfsMatch) url = `https://nftstorage.link/ipfs/${ipfsMatch[1]}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) return null;

        const json = await response.json();
        let imageUrl = json.image || json.imageUrl || null;

        if (imageUrl) {
            const imgMatch = imageUrl.match(/ipfs[./]+(Qm[a-zA-Z0-9]+|bafk[a-zA-Z0-9]+)/i);
            if (imgMatch) imageUrl = `https://nftstorage.link/ipfs/${imgMatch[1]}`;
        }

        return imageUrl;
    } catch {
        return null;
    }
}
