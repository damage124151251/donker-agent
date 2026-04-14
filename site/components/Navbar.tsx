'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Scroll, ExternalLink } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'HOME', icon: Home },
        { href: '/docs', label: 'DOCS', icon: BookOpen },
        { href: '/story', label: 'STORY', icon: Scroll },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 p-4"
            style={{
                background: 'linear-gradient(180deg, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0) 100%)'
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div
                        className="relative w-10 h-10 overflow-hidden"
                        style={{
                            border: '2px solid #FF6B35',
                            boxShadow: '3px 3px 0 rgba(0,0,0,0.5)'
                        }}
                    >
                        <Image
                            src="/donker/donker-logo.png"
                            alt="Donker"
                            fill
                            className="object-cover"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                    <span
                        className="hidden md:block"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            color: '#FF6B35',
                            fontSize: '14px'
                        }}
                    >
                        DONKER
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-2 md:gap-4">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-3 py-2 transition-all hover:opacity-80"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '10px',
                                    color: isActive ? '#FF6B35' : '#A0A0A0',
                                }}
                            >
                                <span className="hidden md:inline">{link.label}</span>
                                <link.icon className="w-5 h-5 md:hidden" />

                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-1"
                                        style={{ background: '#FF6B35' }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {/* External Links */}
                    <div className="flex items-center gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l-2 border-[#252525]">
                        <a
                            href="https://github.com/damage124151251/donker-agent"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:opacity-80 transition"
                            title="GitHub"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="#A0A0A0"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
