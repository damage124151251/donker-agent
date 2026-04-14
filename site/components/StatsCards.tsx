'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Target, Trophy, Skull } from 'lucide-react';
import { SystemStatus } from '@/lib/supabase';

interface StatsCardsProps {
    status: SystemStatus | null;
}

export default function StatsCards({ status }: StatsCardsProps) {
    const formatSOL = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '0.0000';
        return val.toFixed(4);
    };

    const formatPercent = (val: number | null | undefined) => {
        if (val === null || val === undefined) return '0.00';
        return val.toFixed(2);
    };

    const cards = [
        {
            icon: Wallet,
            label: 'BALANCE',
            value: `${formatSOL(status?.balance_sol)} SOL`,
            color: '#FF6B35'
        },
        {
            icon: status?.total_pnl && status.total_pnl >= 0 ? TrendingUp : TrendingDown,
            label: 'TOTAL PNL',
            value: `${status?.total_pnl && status.total_pnl >= 0 ? '+' : ''}${formatSOL(status?.total_pnl)} SOL`,
            color: status?.total_pnl && status.total_pnl >= 0 ? '#00FF88' : '#FF3366'
        },
        {
            icon: status?.today_pnl && status.today_pnl >= 0 ? TrendingUp : TrendingDown,
            label: 'TODAY PNL',
            value: `${status?.today_pnl && status.today_pnl >= 0 ? '+' : ''}${formatSOL(status?.today_pnl)} SOL`,
            color: status?.today_pnl && status.today_pnl >= 0 ? '#00FF88' : '#FF3366'
        },
        {
            icon: Target,
            label: 'WIN RATE',
            value: `${formatPercent(status?.win_rate)}%`,
            color: '#D97757'
        },
        {
            icon: Trophy,
            label: 'WINS',
            value: String(status?.wins || 0),
            subValue: `${status?.win_streak || 0} streak`,
            color: '#00FF88'
        },
        {
            icon: Skull,
            label: 'LOSSES',
            value: String(status?.losses || 0),
            subValue: `${status?.loss_streak || 0} streak`,
            color: '#FF3366'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                        y: -4,
                        x: -4,
                        transition: { duration: 0.15 }
                    }}
                    className="pixel-card p-4 cursor-default"
                    style={{
                        background: '#1A1A1A',
                        border: `4px solid ${card.color}`,
                        position: 'relative'
                    }}
                >
                    {/* Icon and Label */}
                    <div className="flex items-center gap-2 mb-3">
                        <card.icon
                            className="w-5 h-5"
                            style={{ color: card.color }}
                        />
                        <span
                            className="text-xs"
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                color: '#A0A0A0',
                                fontSize: '8px'
                            }}
                        >
                            {card.label}
                        </span>
                    </div>

                    {/* Value */}
                    <div
                        className="text-xl md:text-2xl font-bold"
                        style={{
                            fontFamily: "'VT323', monospace",
                            color: card.color
                        }}
                    >
                        {card.value}
                    </div>

                    {/* Sub Value */}
                    {card.subValue && (
                        <div
                            className="text-xs mt-1"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                color: '#666666'
                            }}
                        >
                            {card.subValue}
                        </div>
                    )}

                    {/* Shine effect */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none opacity-10"
                        style={{
                            background: 'linear-gradient(180deg, white 0%, transparent 100%)'
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
}
