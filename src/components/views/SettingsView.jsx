import React from 'react';
import useAppStore from '../../store/appStore';

export default function SettingsView() {
  const { openaiApiKey, setOpenaiApiKey, clearLibrary, clearBenchmark } = useAppStore();

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold text-white font-display mb-8">Settings</h2>

      {/* OPENAI API KEY SECTION */}
      <div className="glass-panel p-6 mb-4">
        <h3 className="font-display font-semibold text-white mb-1">OpenAI API Key</h3>
        <p className="text-white/40 text-sm mb-4">
          Required for scanning brands not in our 30-brand database.
          Uses GPT-4o. Your key is stored locally and never sent
          to any server other than OpenAI.
        </p>
        <input
          type="password"
          value={openaiApiKey}
          onChange={(e) => setOpenaiApiKey(e.target.value)}
          placeholder="sk-..."
          className="glass-panel w-full px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
        />
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noreferrer"
          className="text-white/30 text-xs mt-3 hover:text-white/60 transition-colors block"
        >
          Get an API key at platform.openai.com →
        </a>
        {openaiApiKey && (
          <p className="text-green-400 text-xs mt-3 font-medium">✓ Key saved — AI scanning enabled</p>
        )}
      </div>

      {/* DATABASE INFO */}
      <div className="glass-panel p-6 mb-8">
        <h3 className="font-display font-semibold text-white mb-2">Built-in Database</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          30 hardcoded brand profiles — Apple, Braun, Braun (Dieter Rams Era), Dyson, Sony, 
          Nike, Adidas, Bang & Olufsen, Muji, Leica, Ferrari, Porsche, 
          Tesla, Herman Miller, Vitra, Aesop, Patagonia, Arc'teryx, 
          Teenage Engineering, Nothing Phone, Rimowa, Bottega Veneta, 
          Loewe, Hoka, Bose, Logitech MX Series, Peak Design, 
          Anglepoise, HAY, Fujifilm.
          <br /><br />
          Use the AI scan for any other brand.
        </p>
      </div>

      {/* DANGER ZONE */}
      <div className="glass-panel p-6 border border-red-500/20">
        <h3 className="font-display font-semibold text-red-400 mb-4">Danger Zone</h3>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your saved brand library?')) {
                clearLibrary();
              }
            }}
            className="text-red-400/80 text-sm hover:text-red-300 transition-colors"
          >
            Clear Brand Library
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the benchmark list?')) {
                clearBenchmark();
              }
            }}
            className="text-red-400/80 text-sm hover:text-red-300 transition-colors"
          >
            Clear Benchmark
          </button>
        </div>
      </div>
    </div>
  );
}
