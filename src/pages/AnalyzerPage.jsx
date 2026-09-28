import React from 'react';
import { Search, BarChart2, BookMarked, Settings } from 'lucide-react';
import useAppStore from '../store/appStore';
import AnalyzeView from '../components/views/AnalyzeView';
import BenchmarkView from '../components/views/BenchmarkView';
import LibraryView from '../components/views/LibraryView';
import SettingsView from '../components/views/SettingsView';

export default function AnalyzerPage() {
  const { activeView, setActiveView } = useAppStore();

  return (
    <div className="flex flex-row h-screen overflow-hidden bg-background">
      {/* SIDEBAR */}
      <div className="glass-panel rounded-none border-r border-white/5 flex flex-col py-6 px-4 w-60 shrink-0">
        {/* Top: logo + "DNA" */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="liquid-glass rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white/80"
            style={{ fontFamily: 'General Sans' }}
          >
            D
          </div>
          <span
            style={{ fontFamily: 'General Sans' }}
            className="font-bold text-lg text-white"
          >
            DNA
          </span>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActiveView('analyze')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeView === 'analyze'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search size={16} /> Analyze
          </button>
          <button
            onClick={() => setActiveView('benchmark')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeView === 'benchmark'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 size={16} /> Benchmark
          </button>
          <button
            onClick={() => setActiveView('library')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeView === 'library'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookMarked size={16} /> Library
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeView === 'settings'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={16} /> Settings
          </button>
        </div>

        {/* Bottom */}
        <div className="mt-auto">
          <p className="text-white/20 text-xs px-3">v1.0 · 30 brands</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeView === 'analyze' && <AnalyzeView />}
        {activeView === 'benchmark' && <BenchmarkView />}
        {activeView === 'library' && <LibraryView />}
        {activeView === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}
