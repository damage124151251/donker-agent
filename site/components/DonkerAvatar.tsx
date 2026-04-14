'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface DonkerAvatarProps {
    mentalState: string;
    sanity: number;
}

export default function DonkerAvatar({ mentalState, sanity }: DonkerAvatarProps) {
    const getAnimation = () => {
        switch (mentalState) {
            case 'CONFIDENT':
                return { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } };
            case 'NERVOUS':
                return { x: [-2, 2, -2], transition: { repeat: Infinity, duration: 0.2 } };
            case 'COPIUM':
                return { rotate: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.5 } };
            case 'FULL_DEGEN':
                return {
                    x: [-3, 3, -3],
                    y: [-3, 3, -3],
                    filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
                    transition: { repeat: Infinity, duration: 0.3 }
                };
            default:
                return { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } };
        }
    };

    const getGlowColor = () => {
        if (sanity >= 80) return 'rgba(0, 255, 136, 0.4)';
        if (sanity >= 60) return 'rgba(255, 107, 53, 0.4)';
        if (sanity >= 40) return 'rgba(255, 217, 61, 0.4)';
        if (sanity >= 20) return 'rgba(217, 119, 87, 0.4)';
        return 'rgba(255, 51, 102, 0.4)';
    };

    const getBorderColor = () => {
        if (sanity >= 80) return '#00FF88';
        if (sanity >= 60) return '#FF6B35';
        if (sanity >= 40) return '#FFD93D';
        if (sanity >= 20) return '#D97757';
        return '#FF3366';
    };

    const getStateLabel = () => {
        switch (mentalState) {
            case 'CONFIDENT': return 'CONFIDENT';
            case 'NORMAL': return 'NORMAL';
            case 'NERVOUS': return 'NERVOUS';
            case 'COPIUM': return 'COPIUM';
            case 'FULL_DEGEN': return 'FULL DEGEN';
            default: return 'LOADING';
        }
    };

    return (
        <motion.div
            animate={getAnimation()}
            className="relative"
        >
            {/* Glow Effect */}
            <div
                className="absolute inset-0 blur-3xl opacity-60"
                style={{ background: getGlowColor() }}
            />

            {/* Pixel Avatar Container */}
            <div
                className="relative w-40 h-40 md:w-52 md:h-52 pixel-corners overflow-hidden"
                style={{
                    boxShadow: `8px 8px 0 rgba(0,0,0,0.8), 0 0 40px ${getGlowColor()}`,
                    border: `4px solid ${getBorderColor()}`,
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #252525 100%)'
                }}
            >
                {/* Donker Logo Image */}
                <Image
                    src="/donker/donker-logo.png"
                    alt="Donker"
                    fill
                    className="object-cover"
                    style={{ imageRendering: 'pixelated' }}
                    priority
                />

                {/* Scanline overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px)'
                    }}
                />

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4" style={{ borderColor: getBorderColor() }} />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4" style={{ borderColor: getBorderColor() }} />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4" style={{ borderColor: getBorderColor() }} />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4" style={{ borderColor: getBorderColor() }} />
            </div>

            {/* Sanity Indicator - Pixel Style */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div
                    className="px-4 py-1"
                    style={{
                        background: '#1A1A1A',
                        border: `3px solid ${getBorderColor()}`,
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.8)'
                    }}
                >
                    <span
                        className="text-xl"
                        style={{
                            fontFamily: "'VT323', monospace",
                            color: getBorderColor()
                        }}
                    >
                        {sanity}%
                    </span>
                </div>
            </div>

            {/* State Label */}
            <div className="text-center mt-8">
                <span
                    className="text-xs uppercase tracking-widest font-bold"
                    style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: getBorderColor()
                    }}
                >
                    {getStateLabel()}
                </span>
            </div>
        </motion.div>
    );
}
