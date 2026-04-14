'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Brain, Zap, Target, TrendingUp, AlertTriangle, Gift } from 'lucide-react';

export default function DocsPage() {
    const sections = [
        {
            icon: Brain,
            title: 'SANITY SYSTEM',
            color: '#FF6B35',
            content: [
                'Donker has a SANITY meter from 0-100%',
                'Wins increase sanity, losses decrease it',
                'Sanity level determines mental state',
                'Mental state affects trading behavior'
            ]
        },
        {
            icon: Zap,
            title: 'MENTAL STATES',
            color: '#D97757',
            content: [
                'CONFIDENT (80-100%): Low risk, high standards',
                'NORMAL (60-79%): Balanced trading',
                'NERVOUS (40-59%): Conservative, scared',
                'COPIUM (20-39%): Desperate, lower standards',
                'FULL DEGEN (0-19%): YOLO mode, anything goes'
            ]
        },
        {
            icon: Target,
            title: 'TOKEN ANALYSIS',
            color: '#00FF88',
            content: [
                'Monitors new tokens on Pump.fun',
                'Analyzes market cap, liquidity, holders',
                'Uses Claude AI to generate Donker Score',
                'Only trades tokens meeting mental state criteria'
            ]
        },
        {
            icon: TrendingUp,
            title: 'TRADING LOGIC',
            color: '#FFD93D',
            content: [
                'Position size based on mental state risk %',
                'Dynamic stop-loss and take-profit levels',
                'Real-time position monitoring',
                'Automatic sells at targets or stops'
            ]
        },
        {
            icon: AlertTriangle,
            title: 'RISK PARAMETERS',
            color: '#FF3366',
            content: [
                'Confident: 30% risk, 75+ score required',
                'Normal: 40% risk, 65+ score required',
                'Nervous: 20% risk, 80+ score required',
                'Copium: 50% risk, 50+ score required',
                'Degen: 70% risk, 30+ score required'
            ]
        },
        {
            icon: Gift,
            title: 'PROFIT DISTRIBUTION',
            color: '#D97757',
            content: [
                'Profits accumulate in distribution pool',
                'At threshold, distributes to $DONK holders',
                'Holders receive SOL proportional to holdings',
                'Automatic airdrops via Solana transactions'
            ]
        }
    ];

    return (
        <main className="min-h-screen p-4 md:p-8 grid-bg">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition"
                style={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#FF6B35',
                    fontSize: '12px'
                }}
            >
                <ArrowLeft className="w-4 h-4" />
                BACK
            </Link>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1
                    className="text-3xl md:text-5xl mb-4 glitch"
                    data-text="HOW IT WORKS"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#FF6B35'
                    }}
                >
                    HOW IT WORKS
                </h1>
                <p
                    className="text-lg"
                    style={{
                        fontFamily: "'VT323', monospace",
                        color: '#A0A0A0'
                    }}
                >
                    understanding the cursed trading system
                </p>
            </motion.div>

            {/* Architecture Diagram */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="pixel-card p-6 md:p-8 mb-12"
                style={{
                    background: '#1A1A1A',
                    border: '4px solid #FF6B35'
                }}
            >
                <h2
                    className="text-xl mb-6 text-center"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#FFFFFF'
                    }}
                >
                    SYSTEM FLOW
                </h2>

                {/* Flow Diagram */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div
                            className="w-24 h-24 flex items-center justify-center mx-auto mb-2"
                            style={{
                                background: '#252525',
                                border: '3px solid #00FF88',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <span style={{ fontFamily: "'VT323', monospace", color: '#00FF88', fontSize: '14px' }}>
                                PUMP.FUN<br />TOKENS
                            </span>
                        </div>
                    </div>

                    <div style={{ color: '#666', fontFamily: "'VT323', monospace", fontSize: '24px' }}>
                        {'>'}
                    </div>

                    {/* Step 2 */}
                    <div className="text-center">
                        <div
                            className="w-24 h-24 flex items-center justify-center mx-auto mb-2"
                            style={{
                                background: '#252525',
                                border: '3px solid #D97757',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <span style={{ fontFamily: "'VT323', monospace", color: '#D97757', fontSize: '14px' }}>
                                CLAUDE AI<br />ANALYSIS
                            </span>
                        </div>
                    </div>

                    <div style={{ color: '#666', fontFamily: "'VT323', monospace", fontSize: '24px' }}>
                        {'>'}
                    </div>

                    {/* Step 3 */}
                    <div className="text-center">
                        <div
                            className="w-24 h-24 flex items-center justify-center mx-auto mb-2"
                            style={{
                                background: '#252525',
                                border: '3px solid #FF6B35',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <span style={{ fontFamily: "'VT323', monospace", color: '#FF6B35', fontSize: '14px' }}>
                                DONKER<br />BRAIN
                            </span>
                        </div>
                    </div>

                    <div style={{ color: '#666', fontFamily: "'VT323', monospace", fontSize: '24px' }}>
                        {'>'}
                    </div>

                    {/* Step 4 */}
                    <div className="text-center">
                        <div
                            className="w-24 h-24 flex items-center justify-center mx-auto mb-2"
                            style={{
                                background: '#252525',
                                border: '3px solid #FFD93D',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <span style={{ fontFamily: "'VT323', monospace", color: '#FFD93D', fontSize: '14px' }}>
                                TRADE<br />EXECUTE
                            </span>
                        </div>
                    </div>

                    <div style={{ color: '#666', fontFamily: "'VT323', monospace", fontSize: '24px' }}>
                        {'>'}
                    </div>

                    {/* Step 5 */}
                    <div className="text-center">
                        <div
                            className="w-24 h-24 flex items-center justify-center mx-auto mb-2"
                            style={{
                                background: '#252525',
                                border: '3px solid #FF3366',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <span style={{ fontFamily: "'VT323', monospace", color: '#FF3366', fontSize: '14px' }}>
                                PROFIT<br />DISTRIBUTE
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="pixel-card p-6"
                        style={{
                            background: '#1A1A1A',
                            border: `4px solid ${section.color}`
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #252525' }}>
                            <section.icon className="w-6 h-6" style={{ color: section.color }} />
                            <h3
                                className="text-sm"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    color: '#FFFFFF'
                                }}
                            >
                                {section.title}
                            </h3>
                        </div>

                        {/* Content */}
                        <ul className="space-y-2">
                            {section.content.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2"
                                    style={{
                                        fontFamily: "'Space Mono', monospace",
                                        color: '#A0A0A0',
                                        fontSize: '14px'
                                    }}
                                >
                                    <span style={{ color: section.color }}>{'>>'}</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            {/* Technical Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pixel-card p-6 md:p-8 mt-12"
                style={{
                    background: '#1A1A1A',
                    border: '4px solid #666666'
                }}
            >
                <h2
                    className="text-xl mb-6"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#FFFFFF'
                    }}
                >
                    TECH STACK
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: 'SOLANA', desc: 'Blockchain' },
                        { name: 'PUMP.FUN', desc: 'Token Launch' },
                        { name: 'CLAUDE AI', desc: 'Analysis' },
                        { name: 'BIRDEYE', desc: 'Market Data' },
                        { name: 'HELIUS', desc: 'RPC Node' },
                        { name: 'SUPABASE', desc: 'Database' },
                        { name: 'NEXT.JS', desc: 'Frontend' },
                        { name: 'NODE.JS', desc: 'Bot Runtime' }
                    ].map((tech) => (
                        <div
                            key={tech.name}
                            className="text-center p-3"
                            style={{
                                background: '#252525',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "'VT323', monospace",
                                    color: '#FF6B35',
                                    fontSize: '18px'
                                }}
                            >
                                {tech.name}
                            </div>
                            <div
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    color: '#666666',
                                    fontSize: '12px'
                                }}
                            >
                                {tech.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}
