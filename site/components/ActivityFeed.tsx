'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { DonkerThought } from '@/lib/supabase';

interface ActivityFeedProps {
    thoughts: DonkerThought[];
}

export default function ActivityFeed({ thoughts }: ActivityFeedProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'startup': return '[SYS]';
            case 'analysis': return '[SCAN]';
            case 'buy': return '[BUY]';
            case 'profit': return '[WIN]';
            case 'loss': return '[LOSS]';
            case 'skip': return '[SKIP]';
            case 'distribute': return '[DIST]';
            case 'streak': return '[STRK]';
            default: return '[THK]';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'startup': return '#00FF88';
            case 'analysis': return '#D97757';
            case 'buy': return '#53d491';
            case 'profit': return '#00FF88';
            case 'loss': return '#FF3366';
            case 'skip': return '#666666';
            case 'distribute': return '#FFD93D';
            case 'streak': return '#53d491';
            default: return '#A0A0A0';
        }
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case 'CONFIDENT': return '#00FF88';
            case 'NORMAL': return '#53d491';
            case 'NERVOUS': return '#FFD93D';
            case 'COPIUM': return '#D97757';
            case 'FULL_DEGEN': return '#FF3366';
            default: return '#666666';
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className="pixel-card p-4 md:p-6"
            style={{
                background: '#1A1A1A',
                border: '4px solid #53d491'
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid #252525' }}>
                <MessageCircle className="w-5 h-5" style={{ color: '#53d491' }} />
                <h2
                    className="text-lg"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: '#FFFFFF'
                    }}
                >
                    THOUGHTS
                </h2>
            </div>

            {/* Feed */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                    {thoughts.map((thought, index) => (
                        <motion.div
                            key={thought.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.02 }}
                            className="p-3"
                            style={{
                                background: '#252525',
                                borderLeft: `4px solid ${getStateColor(thought.mental_state)}`,
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                            }}
                        >
                            <div className="flex items-start gap-3">
                                {/* Type Badge */}
                                <span
                                    className="text-xs px-2 py-1 shrink-0"
                                    style={{
                                        fontFamily: "'VT323', monospace",
                                        background: '#0D0D0D',
                                        color: getTypeColor(thought.type),
                                        border: `1px solid ${getTypeColor(thought.type)}`
                                    }}
                                >
                                    {getTypeIcon(thought.type)}
                                </span>

                                <div className="flex-1 min-w-0">
                                    {/* Thought Text */}
                                    <p
                                        className="text-sm md:text-base break-words"
                                        style={{
                                            fontFamily: "'Space Mono', monospace",
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        {thought.thought}
                                    </p>

                                    {/* Meta Info */}
                                    <div
                                        className="flex flex-wrap items-center gap-2 mt-2 text-xs"
                                        style={{
                                            fontFamily: "'VT323', monospace",
                                            color: '#666666'
                                        }}
                                    >
                                        <span>{formatTime(thought.created_at)}</span>
                                        <span style={{ color: '#444' }}>|</span>
                                        <span style={{ color: getStateColor(thought.mental_state) }}>
                                            {thought.mental_state}
                                        </span>
                                        <span style={{ color: '#444' }}>|</span>
                                        <span>{thought.sanity}% SANITY</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {thoughts.length === 0 && (
                    <div className="text-center py-12">
                        <div
                            className="text-lg mb-2"
                            style={{
                                fontFamily: "'VT323', monospace",
                                color: '#666666'
                            }}
                        >
                            donker is thinking...
                        </div>
                        <div className="flex justify-center gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3"
                                    style={{ background: '#53d491' }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
