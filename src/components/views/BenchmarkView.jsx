import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, ResponsiveContainer } from 'recharts';
import useAppStore from '../../store/appStore';
import { BRAND_DATABASE } from '../../data/brands';

const BRAND_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function BenchmarkView() {
  const { benchmarkBrands, addToBenchmark, removeFromBenchmark, axisOverrides } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      const q = query.toLowerCase();
      const results = BRAND_DATABASE.filter((b) => b.brand.toLowerCase().includes(q)).slice(0, 6);
      setDropdownResults(results);
    } else {
      setDropdownResults([]);
    }
  };

  const selectBrand = (brand) => {
    addToBenchmark(brand);
    setSearchQuery('');
    setDropdownResults([]);
  };

  // Build radar data
  const radarData = [
    { axis: 'Minimal↔Maximal' },
    { axis: 'Cold↔Warm' },
    { axis: 'Rigid↔Soft' },
    { axis: 'Geometric↔Org.' },
    { axis: 'Loud↔Quiet' },
  ];

  const axisKeys = ['minimalVsMaximal', 'coldVsWarm', 'rigidVsSoft', 'geometricVsOrganic', 'loudVsQuiet'];

  benchmarkBrands.forEach((b) => {
    const axes = axisOverrides[b.brand] || b.designAxes;
    radarData[0][b.brand] = axes.minimalVsMaximal;
    radarData[1][b.brand] = axes.coldVsWarm;
    radarData[2][b.brand] = axes.rigidVsSoft;
    radarData[3][b.brand] = axes.geometricVsOrganic;
    radarData[4][b.brand] = axes.loudVsQuiet;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white font-display mb-4">Benchmark Analysis</h2>
        
        {/* TOP: "Add brand to compare" search bar */}
        <div className="relative max-w-xl z-50">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Add brand to compare (max 5)..."
            className="w-full glass-panel pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
            disabled={benchmarkBrands.length >= 5}
          />
          {dropdownResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass-panel overflow-hidden">
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

        {/* Selected chips */}
        {benchmarkBrands.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {benchmarkBrands.map((brand, i) => (
              <div
                key={brand.brand}
                className="liquid-glass rounded-full px-3 py-1.5 flex items-center gap-2"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: BRAND_COLORS[i] }}
                />
                <span className="text-sm text-white/90">{brand.brand}</span>
                <button
                  onClick={() => removeFromBenchmark(brand.brand)}
                  className="text-white/40 hover:text-white transition-colors p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {benchmarkBrands.length > 0 ? (
        <>
          {/* OVERLAY RADAR */}
          <div className="glass-panel p-6 mt-6">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Geist Sans' }}
                />
                {benchmarkBrands.map((brand, i) => (
                  <Radar
                    key={brand.brand}
                    name={brand.brand}
                    dataKey={brand.brand}
                    stroke={BRAND_COLORS[i]}
                    strokeWidth={2}
                    fill={BRAND_COLORS[i]}
                    fillOpacity={0.15}
                    isAnimationActive={false}
                  />
                ))}
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* DIFF COLUMNS */}
          <div
            className="grid gap-4 mt-6"
            style={{ gridTemplateColumns: `repeat(${benchmarkBrands.length}, minmax(0, 1fr))` }}
          >
            {benchmarkBrands.map((brand, i) => {
              const axes = axisOverrides[brand.brand] || brand.designAxes;
              
              // Helper to check if a value is an outlier (max - min > 3 across all brands)
              const isOutlier = (key) => {
                const vals = benchmarkBrands.map((b) => {
                  if (key === 'cornerRadiusIndex') return b.geometry.cornerRadiusIndex;
                  if (key === 'detailDensity') return b.surfaceLanguage.detailDensity;
                  const bAxes = axisOverrides[b.brand] || b.designAxes;
                  return bAxes[key];
                });
                const min = Math.min(...vals);
                const max = Math.max(...vals);
                return max - min > 3;
              };

              const getBgClass = (key) =>
                isOutlier(key) ? 'bg-amber-500/10 text-amber-300' : 'text-white/80';

              return (
                <div key={brand.brand} className="glass-panel p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[i] }} />
                    <h3 className="font-semibold text-white text-sm">{brand.brand}</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Corner Radius</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono ${getBgClass('cornerRadiusIndex')}`}>
                        {brand.geometry.cornerRadiusIndex}/10
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Detail Density</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono ${getBgClass('detailDensity')}`}>
                        {brand.surfaceLanguage.detailDensity}/10
                      </span>
                    </div>
                    
                    <div className="w-full h-px bg-white/5 my-2" />
                    
                    {axisKeys.map((key, idx) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-white/40">{radarData[idx].axis}</span>
                        <span className={`px-1.5 py-0.5 rounded font-mono ${getBgClass(key)}`}>
                          {axes[key]}/10
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-20 glass-panel mt-6">
          <BarChart2 size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No brands selected for comparison.</p>
          <p className="text-white/20 text-sm">
            Search and add up to 5 brands to see their DNA mapped together.
          </p>
        </div>
      )}
    </div>
  );
}
