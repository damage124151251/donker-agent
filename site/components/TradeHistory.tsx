'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, ExternalLink } from 'lucide-react';
import { Trade } from '@/lib/supabase';

interface TradeHistoryProps {
    trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
    const formatSOL = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '0.0000';
        return val.toFixed(4);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const shortenAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    return (
        <div
            className="pixel-card p-4 md:p-6"
            style={{
                background: '#1A1A1A',
                border: '4px solid #D97757'
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #252525' }}>
                <History className="w-5 h-5" style={{ color: '#D97757' }} />
                <h2
                    className="text-lg"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#FFFFFF'
                    }}
                >
                    TRADES
                </h2>
            </div>

            {/* Trade List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                    {trades.map((trade, index) => (
                        <motion.div
                            key={trade.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.02 }}
                            className="p-3"
                            style={{
                                background: '#252525',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            {/* Trade Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {/* Trade Type Badge */}
                                    <span
                                        className="px-2 py-1 text-xs font-bold uppercase"
                                        style={{
                                            fontFamily: "'Press Start 2P', cursive",
                                            fontSize: '8px',
                                            background: trade.tipo === 'buy' ? '#00FF88' : '#FF3366',
                                            color: '#0D0D0D',
                                            boxShadow: '2px 2px 0 rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        {trade.tipo}
                                    </span>
                                    <span
                                        className="font-bold"
                                        style={{
                                            fontFamily: "'VT323', monospace",
                                            color: '#FFFFFF',
                                            fontSize: '18px'
                                        }}
                                    >
                                        {trade.tokens?.simbolo || shortenAddress(trade.token_id)}
                                    </span>
                                </div>
                                <span
                                    className="text-xs"
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        color: '#666666'
                                    }}
                                >
                                    {formatTime(trade.data)}
                                </span>
                            </div>

                            {/* Trade Details */}
                            <div
                                className="flex items-center justify-between text-sm"
                                style={{ fontFamily: "'VT323', monospace" }}
                            >
                                <span style={{ color: '#A0A0A0' }}>
                                    {formatSOL(trade.valor_sol)} SOL
                                </span>
                                {trade.pnl_sol !== null && (
                                    <span style={{ color: trade.pnl_sol >= 0 ? '#00FF88' : '#FF3366' }}>
                                        {trade.pnl_sol >= 0 ? '+' : ''}{formatSOL(trade.pnl_sol)} SOL
                                        {trade.pnl_percent !== null && (
                                            <span className="text-xs ml-1">
                                                ({trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent?.toFixed(1)}%)
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>

                            {/* Donker Reaction */}
                            {trade.donker_reaction && (
                                <div
                                    className="mt-2 text-xs italic"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        color: '#666666'
                                    }}
                                >
                                    "{trade.donker_reaction}"
                                </div>
                            )}

                            {/* TX Link */}
                            {trade.tx_signature && (
                                <a
                                    href={`https://solscan.io/tx/${trade.tx_signature}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 mt-2 text-xs hover:underline"
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        color: '#FF6B35'
                                    }}
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    VIEW TX
                                </a>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {trades.length === 0 && (
                    <div className="text-center py-12">
                        <div
                            className="text-lg mb-2"
                            style={{
                                fontFamily: "'VT323', monospace",
                                color: '#666666'
                            }}
                        >
                            no trades yet...
                        </div>
                        <div
                            className="text-xs"
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                color: '#444444'
                            }}
                        >
                            waiting for donker
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
