'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Position } from '@/lib/supabase';

interface PositionsTableProps {
    positions: Position[];
}

export default function PositionsTable({ positions }: PositionsTableProps) {
    const formatSOL = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '0.0000';
        return val.toFixed(4);
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
                border: '4px solid #FFD93D'
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #252525' }}>
                <Briefcase className="w-5 h-5" style={{ color: '#FFD93D' }} />
                <h2
                    className="text-lg"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#FFFFFF'
                    }}
                >
                    POSITIONS
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr
                            className="text-left text-sm"
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '8px',
                                color: '#666666',
                                borderBottom: '2px solid #252525'
                            }}
                        >
                            <th className="pb-3">TOKEN</th>
                            <th className="pb-3">SIZE</th>
                            <th className="pb-3">ENTRY</th>
                            <th className="pb-3">CURRENT</th>
                            <th className="pb-3">PNL</th>
                            <th className="pb-3">SL/TP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((pos, index) => (
                            <motion.tr
                                key={pos.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                style={{ borderBottom: '1px solid #252525' }}
                            >
                                <td
                                    className="py-3"
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        color: '#FFFFFF',
                                        fontSize: '18px'
                                    }}
                                >
                                    {pos.tokens?.simbolo || shortenAddress(pos.token_id)}
                                </td>
                                <td
                                    className="py-3"
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        color: '#FF6B35'
                                    }}
                                >
                                    {formatSOL(pos.valor_sol)} SOL
                                </td>
                                <td
                                    className="py-3 text-sm"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        color: '#A0A0A0'
                                    }}
                                >
                                    ${pos.entry_price?.toFixed(8)}
                                </td>
                                <td
                                    className="py-3 text-sm"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        color: '#FFFFFF'
                                    }}
                                >
                                    ${pos.current_price?.toFixed(8)}
                                </td>
                                <td
                                    className="py-3"
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        color: pos.pnl_percent >= 0 ? '#00FF88' : '#FF3366'
                                    }}
                                >
                                    {pos.pnl_percent >= 0 ? '+' : ''}{pos.pnl_percent?.toFixed(2)}%
                                    <div
                                        className="text-xs"
                                        style={{ color: pos.pnl_sol >= 0 ? '#00FF88' : '#FF3366' }}
                                    >
                                        ({pos.pnl_sol >= 0 ? '+' : ''}{formatSOL(pos.pnl_sol)} SOL)
                                    </div>
                                </td>
                                <td className="py-3 text-xs">
                                    <span
                                        className="px-1"
                                        style={{
                                            fontFamily: "'VT323', monospace",
                                            background: '#FF336633',
                                            color: '#FF3366'
                                        }}
                                    >
                                        {pos.stop_loss}%
                                    </span>
                                    <span style={{ color: '#666' }}> / </span>
                                    <span
                                        className="px-1"
                                        style={{
                                            fontFamily: "'VT323', monospace",
                                            background: '#00FF8833',
                                            color: '#00FF88'
                                        }}
                                    >
                                        {pos.take_profit}%
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {positions.length === 0 && (
                <div className="text-center py-8">
                    <div
                        style={{
                            fontFamily: "'VT323', monospace",
                            color: '#666666'
                        }}
                    >
                        no open positions
                    </div>
                </div>
            )}
        </div>
    );
}
