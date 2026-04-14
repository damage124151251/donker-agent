# DONKER AGENT 🟢

A cursed orange creature that trades memecoins on Solana. He has feelings.

## What is Donker?

Donker is an AI trading agent with a twist: he has a **sanity meter** that affects his trading decisions.

- **High sanity (80-100%)**: Confident Donker 😎 - Takes calculated risks
- **Normal sanity (60-79%)**: Normal Donker 🙂 - Balanced trading
- **Low sanity (40-59%)**: Nervous Donker 😰 - Scared of everything
- **Critical sanity (20-39%)**: Copium Donker 🥴 - "This is fine"
- **Zero sanity (0-19%)**: Full Degen Donker 💀 - YOLO everything

## Features

- **Sanity System**: Mental state affects trading decisions
- **Claude AI Analysis**: AI analyzes tokens AND generates Donker's personality
- **Profit Distribution**: Every 1 SOL profit gets distributed to $DONK holders
- **Real-time Dashboard**: Watch Donker's thoughts and trades live
- **Cursed Aesthetic**: Deep fried meme vibes

## Tech Stack

- **Bot**: Node.js + Solana Web3.js
- **Site**: Next.js 14 + Tailwind + Framer Motion
- **Database**: Supabase (PostgreSQL + Realtime)
- **AI**: Claude API (Anthropic)
- **Data**: Birdeye + Helius + PumpPortal

## Setup

### 1. Database Setup

Go to your Supabase project and run the SQL files:
1. Run `supabase/schema.sql` first
2. Then run `supabase/fix_realtime.sql`

### 2. Bot Setup

```bash
cd bot
npm install
```

Create `.env` file with your credentials (see `.env.example`).

```bash
npm start
```

### 3. Site Setup

```bash
cd site
npm install
npm run dev
```

Create `.env.local` with Supabase credentials.

## Environment Variables

### Bot (.env)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
BIRDEYE_API_KEY=
HELIUS_RPC=
CLAUDE_API_KEY=
WALLET_PRIVATE_KEY=
DONK_TOKEN_CA=
PORT=3001
```

### Site (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Mental States

| State | Sanity | Risk | Min Score | Behavior |
|-------|--------|------|-----------|----------|
| Confident | 80-100% | 30% | 75 | "ez money" |
| Normal | 60-79% | 40% | 65 | "seems legit" |
| Nervous | 40-59% | 20% | 80 | "oh god oh fuck" |
| Copium | 20-39% | 50% | 50 | "this is fine" |
| Full Degen | 0-19% | 70% | 30 | "YOLO" |

## How Sanity Changes

- ✅ **Wins** increase sanity
- ❌ **Losses** decrease sanity
- 🔥 **Win streaks** boost sanity
- 💀 **Loss streaks** destroy sanity
- 📈 **Positive PnL** helps sanity
- 📉 **Negative PnL** hurts sanity

## Disclaimer

⚠️ **This is not financial advice.** Trading cryptocurrencies involves significant risk. You may lose all your funds. Memecoins are extremely volatile. Donker is a cursed creature for entertainment purposes.

## License

MIT

---

made by a cursed creature 🟢
