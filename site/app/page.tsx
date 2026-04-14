'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getSupabase,
    getSystemStatus,
    getThoughts,
    getTrades,
    getOpenPositions,
    SystemStatus,
    DonkerThought,
    Trade,
    Position
} from '@/lib/supabase';
import DonkerAvatar from '@/components/DonkerAvatar';
import SanityBar from '@/components/SanityBar';
import ThoughtBubble from '@/components/ThoughtBubble';
import StatsCards from '@/components/StatsCards';
import ActivityFeed from '@/components/ActivityFeed';
import TradeHistory from '@/components/TradeHistory';
import PositionsTable from '@/components/PositionsTable';
import LoadingScreen from '@/components/LoadingScreen';

// Bot wallet address
const BOT_WALLET = 'AHesmytsqbDq2DanPGxyuGZKe3VUP9vvQoQcjHsyAjaP';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [thoughts, setThoughts] = useState<DonkerThought[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [latestThought, setLatestThought] = useState<string>('waiting for donker to wake up...');

    // Initial load
    useEffect(() => {
        const init = async () => {
            await loadData();
            // Simulate minimum loading time for effect
            setTimeout(() => setIsLoading(false), 2000);
        };
        init();

        const supabase = getSupabase();

        // Set up realtime subscriptions
        const statusChannel = supabase
            .channel('system_status_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'system_status' }, () => {
                loadStatus();
            })
            .subscribe();

        const thoughtsChannel = supabase
            .channel('thoughts_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donker_thoughts' }, (payload) => {
                const newThought = payload.new as DonkerThought;
                setThoughts(prev => [newThought, ...prev.slice(0, 19)]);
                setLatestThought(newThought.thought);
            })
            .subscribe();

        const tradesChannel = supabase
            .channel('trades_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trades' }, () => {
                loadTrades();
            })
            .subscribe();

        const positionsChannel = supabase
            .channel('positions_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'positions' }, () => {
                loadPositions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(statusChannel);
            supabase.removeChannel(thoughtsChannel);
            supabase.removeChannel(tradesChannel);
            supabase.removeChannel(positionsChannel);
        };
    }, []);

    async function loadData() {
        await Promise.all([loadStatus(), loadThoughts(), loadTrades(), loadPositions()]);
    }

    async function loadStatus() {
        const data = await getSystemStatus();
        setStatus(data);
    }

    async function loadThoughts() {
        const data = await getThoughts();
        setThoughts(data);
        if (data.length > 0) {
            setLatestThought(data[0].thought);
        }
    }

    async function loadTrades() {
        const data = await getTrades();
        setTrades(data);
    }

    async function loadPositions() {
        const data = await getOpenPositions();
        setPositions(data);
    }

    const getMentalStateDisplay = (state?: string): string => {
        switch (state) {
            case 'CONFIDENT': return 'CONFIDENT DONKER';
            case 'NORMAL': return 'NORMAL DONKER';
            case 'NERVOUS': return 'NERVOUS DONKER';
            case 'COPIUM': return 'COPIUM DONKER';
            case 'FULL_DEGEN': return 'FULL DEGEN DONKER';
            default: return 'LOADING...';
        }
    };

    const getMentalStateColor = (state?: string): string => {
        switch (state) {
            case 'CONFIDENT': return '#00FF88';
            case 'NORMAL': return '#53d491';
            case 'NERVOUS': return '#FFD93D';
            case 'COPIUM': return '#D97757';
            case 'FULL_DEGEN': return '#FF3366';
            default: return '#666666';
        }
    };

    return (
        <>
            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && <LoadingScreen isLoading={isLoading} />}
            </AnimatePresence>

            <main className="min-h-screen p-4 md:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1
                        className="text-4xl md:text-6xl mb-4 glitch"
                        data-text="DONKER TRADER"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            color: '#53d491'
                        }}
                    >
                        DONKER TRADER
                    </h1>
                    <p
                        className="text-lg mb-4"
                        style={{
                            fontFamily: "'VT323', monospace",
                            color: '#A0A0A0'
                        }}
                    >
                        cursed memecoin trading on solana
                    </p>

                    {/* Status Badge */}
                    <div className="flex justify-center items-center gap-4">
                        <span
                            className="px-4 py-2"
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '10px',
                                background: status?.status === 'ONLINE' ? '#00FF88' : '#FF3366',
                                color: '#0D0D0D',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            {status?.status || 'OFFLINE'}
                        </span>
                    </div>
                </motion.div>

                {/* Bot Wallet Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <div
                        className="pixel-card p-4 flex items-center gap-4"
                        style={{
                            background: '#1A1A1A',
                            border: '4px solid #666666'
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '10px',
                                color: '#666666'
                            }}
                        >
                            BOT WALLET:
                        </span>
                        <a
                            href={`https://solscan.io/account/${BOT_WALLET}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{
                                fontFamily: "'VT323', monospace",
                                color: '#53d491',
                                fontSize: '16px'
                            }}
                        >
                            {BOT_WALLET.slice(0, 8)}...{BOT_WALLET.slice(-8)}
                        </a>
                    </div>
                </motion.div>

                {/* Donker Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center gap-8 mb-12"
                >
                    <DonkerAvatar
                        mentalState={status?.mental_state || 'NORMAL'}
                        sanity={status?.sanity || 50}
                    />

                    <div className="flex-1 w-full max-w-xl">
                        <ThoughtBubble thought={latestThought} />

                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-3">
                                <span
                                    style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '12px',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    SANITY
                                </span>
                                <span
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        fontSize: '28px',
                                        color: getMentalStateColor(status?.mental_state)
                                    }}
                                >
                                    {status?.sanity || 50}%
                                </span>
                            </div>
                            <SanityBar sanity={status?.sanity || 50} />
                            <div className="mt-4 text-center">
                                <span
                                    style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '10px',
                                        color: getMentalStateColor(status?.mental_state)
                                    }}
                                >
                                    {getMentalStateDisplay(status?.mental_state)}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <StatsCards status={status} />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                    {/* Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ActivityFeed thoughts={thoughts} />
                    </motion.div>

                    {/* Trade History */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <TradeHistory trades={trades} />
                    </motion.div>
                </div>

                {/* Open Positions */}
                {positions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8"
                    >
                        <PositionsTable positions={positions} />
                    </motion.div>
                )}

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <div
                        className="inline-block p-4 pixel-card"
                        style={{
                            background: '#1A1A1A',
                            border: '4px solid #252525'
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "'VT323', monospace",
                                color: '#666666',
                                fontSize: '16px'
                            }}
                        >
                            made by a cursed orange creature
                        </p>
                        <div className="flex justify-center gap-4 mt-3">
                            <a
                                href="/docs"
                                className="hover:opacity-80 transition"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '8px',
                                    color: '#53d491'
                                }}
                            >
                                DOCS
                            </a>
                            <span style={{ color: '#333' }}>|</span>
                            <a
                                href="/story"
                                className="hover:opacity-80 transition"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '8px',
                                    color: '#53d491'
                                }}
                            >
                                STORY
                            </a>
                            <span style={{ color: '#333' }}>|</span>
                            <a
                                href="https://github.com/damage124151251/donker-agent"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '8px',
                                    color: '#53d491'
                                }}
                            >
                                GITHUB
                            </a>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
