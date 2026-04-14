'use client';

import { motion } from 'framer-motion';

interface SanityBarProps {
    sanity: number;
}

export default function SanityBar({ sanity }: SanityBarProps) {
    const getColor = () => {
        if (sanity >= 60) return '#00FF88';
        if (sanity >= 30) return '#FFD93D';
        return '#FF3366';
    };

    const getSegments = () => {
        const segments = [];
        for (let i = 0; i < 10; i++) {
            const isActive = sanity > i * 10;
            const segmentColor = isActive ? getColor() : '#252525';

            segments.push(
                <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0.3 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 h-full"
                    style={{
                        background: isActive
                            ? `repeating-linear-gradient(90deg, ${segmentColor}, ${segmentColor} 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)`
                            : segmentColor,
                        margin: '0 2px',
                        boxShadow: isActive ? `0 0 10px ${segmentColor}40` : 'none'
                    }}
                />
            );
        }
        return segments;
    };

    return (
        <div className="w-full">
            {/* Pixel Progress Bar */}
            <div
                className="h-8 flex items-center p-1"
                style={{
                    background: '#1A1A1A',
                    border: '3px solid #A0A0A0',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
                }}
            >
                {getSegments()}
            </div>

            {/* Labels */}
            <div
                className="flex justify-between mt-2 text-xs"
                style={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: '#666666'
                }}
            >
                <span className="text-[#FF3366]">DEGEN</span>
                <span className="text-[#FFD93D]">NORMAL</span>
                <span className="text-[#00FF88]">CONFIDENT</span>
            </div>
        </div>
    );
}
