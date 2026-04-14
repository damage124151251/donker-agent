'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ThoughtBubbleProps {
    thought: string;
}

export default function ThoughtBubble({ thought }: ThoughtBubbleProps) {
    return (
        <div
            className="relative p-6 pixel-corners"
            style={{
                background: '#1A1A1A',
                border: '4px solid #FF6B35',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.8), 0 0 30px rgba(255, 107, 53, 0.2)'
            }}
        >
            {/* Pixel speech bubble tail */}
            <div
                className="absolute -left-4 top-8 w-4 h-4"
                style={{
                    background: '#FF6B35'
                }}
            />
            <div
                className="absolute -left-2 top-8 w-4 h-4"
                style={{
                    background: '#1A1A1A'
                }}
            />

            {/* Glitch effect on the border */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    background: 'repeating-linear-gradient(0deg, rgba(255,107,53,0.1), rgba(255,107,53,0.1) 1px, transparent 1px, transparent 2px)'
                }}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={thought}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Quote marks */}
                    <span
                        className="absolute -top-2 left-4 text-4xl"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            color: '#FF6B35',
                            opacity: 0.5
                        }}
                    >
                        "
                    </span>

                    <p
                        className="text-xl md:text-2xl text-center px-4"
                        style={{
                            fontFamily: "'VT323', monospace",
                            color: '#FFFFFF',
                            lineHeight: 1.4
                        }}
                    >
                        {thought}
                    </p>

                    <span
                        className="absolute -bottom-6 right-4 text-4xl"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            color: '#FF6B35',
                            opacity: 0.5
                        }}
                    >
                        "
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
