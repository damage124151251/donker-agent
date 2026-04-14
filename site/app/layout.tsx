import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'DONKER AGENT | cursed memecoin trading',
    description: 'A cursed orange creature that trades memecoins. Sanity goes down, degen goes up. Distributes profits to $DONK holders.',
    keywords: ['solana', 'memecoin', 'trading', 'bot', 'pumpfun', 'donker'],
    icons: {
        icon: '/donker/donker-logo.png',
        apple: '/donker/donker-logo.png',
    },
    openGraph: {
        title: 'DONKER AGENT',
        description: 'cursed memecoin trading agent',
        type: 'website',
        images: ['/donker/donker-logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DONKER AGENT',
        description: 'cursed memecoin trading agent',
        images: ['/donker/donker-logo.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="scanlines grid-bg">
                <Navbar />
                <div className="pt-16">
                    {children}
                </div>
            </body>
        </html>
    );
}
