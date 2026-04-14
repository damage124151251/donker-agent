export default function Privacy() {
    return (
        <div className="min-h-screen bg-bg-primary text-white p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-donker-orange">Privacy Policy</h1>
            <p className="text-white-muted mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
            <p className="text-gray-300 mb-4">
                We collect wallet addresses for transaction purposes only. We do not collect personal information.
                All trading data displayed is public blockchain information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Information</h2>
            <p className="text-gray-300 mb-4">
                Wallet addresses are used solely to execute and display transactions on the Solana blockchain.
                Trading statistics are aggregated for display purposes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Data Storage</h2>
            <p className="text-gray-300 mb-4">
                Transaction data is stored for display purposes. All blockchain data is public by nature.
                We use Supabase for data storage with industry-standard security practices.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Third-Party Services</h2>
            <p className="text-gray-300 mb-4">
                We use third-party APIs including Birdeye, Helius, and PumpPortal for blockchain data.
                These services have their own privacy policies.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
            <p className="text-gray-300">
                For questions about this policy, contact us on Twitter/X.
            </p>

            <a href="/" className="inline-block mt-8 text-donker-orange hover:underline">
                ← Back to Donker
            </a>
        </div>
    );
}
