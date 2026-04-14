export default function Terms() {
    return (
        <div className="min-h-screen bg-bg-primary text-white p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-donker-orange">Terms of Service</h1>
            <p className="text-white-muted mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
                By using this service, you agree to these terms. This is an experimental project
                created for entertainment and educational purposes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Risk Disclaimer</h2>
            <p className="text-gray-300 mb-4">
                <strong className="text-red-400">Trading cryptocurrencies involves significant risk.</strong> You may lose all your funds.
                This is not financial advice. Do your own research before trading. Memecoins are
                extremely volatile and most go to zero.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">No Guarantees</h2>
            <p className="text-gray-300 mb-4">
                We make no guarantees about profits or performance. Past performance does not indicate future results.
                Donker is a cursed creature that may or may not make good trading decisions.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Experimental Nature</h2>
            <p className="text-gray-300 mb-4">
                This is an experimental AI trading agent. The "mental state" and "sanity" systems are
                entertainment features. Trading decisions should not be taken as financial advice.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
                We are not liable for any losses incurred through use of this service. By using this
                service, you acknowledge and accept all risks associated with cryptocurrency trading.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Distribution Program</h2>
            <p className="text-gray-300 mb-4">
                The profit distribution program is experimental and may be modified or discontinued
                at any time. Distributions are made at the discretion of the project.
            </p>

            <a href="/" className="inline-block mt-8 text-donker-orange hover:underline">
                ← Back to Donker
            </a>
        </div>
    );
}
