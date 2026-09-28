import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { BRAND_DATABASE } from '../../data/brands';
import { analyzeBrandWithAI } from '../../utils/openaiAnalysis';
import DNACard from '../DNACard';

export default function AnalyzeView() {
  const { activeBrand, setActiveBrand, openaiApiKey } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const [isAIScanning, setIsAIScanning] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setAiError('');
    if (query.length >= 2) {
      const q = query.toLowerCase();
      const results = BRAND_DATABASE.filter(b => b.brand.toLowerCase().includes(q)).slice(0, 6);
      setDropdownResults(results);
    } else {
      setDropdownResults([]);
    }
  };

  const selectBrand = (brand) => {
    setActiveBrand(brand);
    setSearchQuery('');
    setDropdownResults([]);
    setAiError('');
  };

  const selectBrandByName = (name) => {
    const found = BRAND_DATABASE.find(b => b.brand.toLowerCase() === name.toLowerCase());
    if (found) {
      selectBrand(found);
    }
  };

  const handleAIScan = async () => {
    if (!openaiApiKey) return;
    setIsAIScanning(true);
    setAiError('');
    setDropdownResults([]);
    try {
      const result = await analyzeBrandWithAI(searchQuery, openaiApiKey);
      setActiveBrand(result);
      setSearchQuery('');
    } catch (error) {
      setAiError(error.message);
    } finally {
      setIsAIScanning(false);
    }
  };

  const showNotFound = searchQuery.length >= 2 && dropdownResults.length === 0 && !isAIScanning;

  return (
    <div className="max-w-6xl mx-auto">
      {/* SEARCH BAR */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search a brand — Apple, Nike, Braun…"
          className="w-full glass-panel pl-12 pr-4 py-4 text-lg text-white placeholder-white/30 outline-none focus:border-white/20"
        />
        {dropdownResults.length > 0 && !isAIScanning && (
          <div className="absolute top-full mt-2 w-full glass-panel overflow-hidden z-50">
            {dropdownResults.map((brand) => (
              <button
                key={brand.brand}
                onClick={() => selectBrand(brand)}
                className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>{brand.brand}</span>
                <span className="text-white/30 text-xs">{brand.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* NOT FOUND STATE */}
      {showNotFound && (
        <>
          {openaiApiKey ? (
            <div className="text-center mt-4">
              <p className="text-white/50 text-sm mb-3">"{searchQuery}" isn't in our database</p>
              <button
                onClick={handleAIScan}
                className="liquid-glass rounded-full px-6 py-3 text-sm text-white flex items-center gap-2 mx-auto"
              >
                <Sparkles size={14} /> Scan with AI →
              </button>
            </div>
          ) : (
            <p className="text-white/30 text-xs text-center mt-2">
              Add an OpenAI key in Settings to scan any brand
            </p>
          )}
        </>
      )}

      {/* AI ERROR STATE */}
      {aiError && (
        <p className="text-red-400 text-sm text-center mt-4">{aiError}</p>
      )}

      {/* AI SCANNING STATE */}
      {isAIScanning && (
        <div className="space-y-4 mt-8">
          <div className="skeleton h-12 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-48 rounded-2xl" />
          <p className="text-white/40 text-sm text-center mt-2 animate-pulse">
            Analyzing {searchQuery} with GPT-4o…
          </p>
        </div>
      )}

      {/* POPULAR SEARCHES */}
      {!searchQuery && !activeBrand && !isAIScanning && (
        <div className="max-w-2xl mx-auto">
          <p className="text-white/30 text-xs mb-3 text-center">Popular searches</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Apple', 'Braun', 'Dyson', 'Nike', 'Bang & Olufsen', 'Tesla', 'Teenage Engineering', 'Leica'].map((name) => (
              <button
                key={name}
                onClick={() => selectBrandByName(name)}
                className="liquid-glass rounded-full px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BRAND DISPLAY */}
      {activeBrand && !isAIScanning && (
        <DNACard brand={activeBrand} />
      )}
    </div>
  );
}
