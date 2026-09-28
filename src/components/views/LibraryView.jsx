import React, { useState } from 'react';
import { BookMarked, X, Search } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, ResponsiveContainer } from 'recharts';
import useAppStore from '../../store/appStore';

const CATEGORIES = [
  'All',
  'Consumer Electronics',
  'Automotive',
  'Furniture',
  'Fashion',
  'Sportswear',
  'Lifestyle',
  'Photography',
  'Audio'
];

export default function LibraryView() {
  const { savedBrands, removeSavedBrand, setActiveBrand, setActiveView, addToBenchmark, axisOverrides } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = savedBrands.filter(brand => {
    const matchesCategory = activeCategory === 'All' || brand.category === activeCategory;
    const matchesSearch = brand.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white font-display">Brand Library</h2>
        <span className="text-white/40 text-sm">{savedBrands.length} saved</span>
      </div>

      {savedBrands.length > 0 ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search library..."
                className="w-full glass-panel pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`liquid-glass rounded-full px-3 py-1.5 text-xs transition-colors ${
                    activeCategory === cat ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredBrands.map(brand => {
              const axes = axisOverrides[brand.brand] || brand.designAxes;
              const radarData = [
                { score: axes.minimalVsMaximal },
                { score: axes.coldVsWarm },
                { score: axes.rigidVsSoft },
                { score: axes.geometricVsOrganic },
                { score: axes.loudVsQuiet },
              ];

              return (
                <div key={brand.brand} className="glass-panel p-4 flex flex-col gap-3 relative group">
                  <button
                    onClick={() => removeSavedBrand(brand.brand)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Remove from library"
                  >
                    <X size={14} />
                  </button>

                  <div>
                    <h3 className="font-display font-semibold text-white text-lg">{brand.brand}</h3>
                    <span className="text-white/40 text-xs">{brand.category}</span>
                  </div>

                  <div className="bg-white/5 rounded-xl -mx-2">
                    <ResponsiveContainer width="100%" height={120}>
                      <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.05)" />
                        <Radar
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={1.5}
                          fill="#6366f1"
                          fillOpacity={0.2}
                          isAnimationActive={false}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {brand.qualitative.designKeywords.slice(0, 4).map(kw => (
                      <span key={kw} className="bg-white/5 rounded-sm px-1.5 py-0.5 text-[10px] text-white/50">
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
                    <button
                      onClick={() => {
                        setActiveBrand(brand);
                        setActiveView('analyze');
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => addToBenchmark(brand)}
                      className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-white text-xs py-2 rounded-lg transition-colors"
                    >
                      Benchmark +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBrands.length === 0 && (
            <p className="text-center text-white/40 mt-12 text-sm">No brands match your filters.</p>
          )}
        </>
      ) : (
        <div className="col-span-3 text-center py-20">
          <BookMarked size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No brands saved yet.</p>
          <p className="text-white/20 text-sm mt-1">
            Analyze a brand and hit Save to add it here.
          </p>
        </div>
      )}
    </div>
  );
}
