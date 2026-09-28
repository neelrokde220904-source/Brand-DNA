import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, BarChart2, Download, FileJson, SlidersHorizontal } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import useAppStore from '../store/appStore';
import { exportToPDF, exportToJSON } from '../utils/exportUtils';
import { BRAND_DATABASE } from '../data/brands';
import BrandImagePanel from './BrandImagePanel';
import GeometryPanel from './GeometryPanel';
import SurfacePanel from './SurfacePanel';
import CMFPanel from './CMFPanel';

export default function DNACard({ brand }) {
  const { savedBrands, saveBrand, addToBenchmark, setActiveBrand, axisOverrides, setAxisOverride } = useAppStore();
  const [editMode, setEditMode] = useState(false);
  const [localAxes, setLocalAxes] = useState(brand.designAxes);

  const isSaved = savedBrands.some((b) => b.brand === brand.brand);

  // Initialize local axes from overrides if they exist
  useEffect(() => {
    if (axisOverrides[brand.brand]) {
      setLocalAxes(axisOverrides[brand.brand]);
    } else {
      setLocalAxes(brand.designAxes);
    }
  }, [brand, axisOverrides]);

  // Compute Category Average
  const categoryBrands = BRAND_DATABASE.filter(b => b.category === brand.category);
  const avgAxes = {
    minimalVsMaximal: categoryBrands.reduce((sum, b) => sum + b.designAxes.minimalVsMaximal, 0) / categoryBrands.length,
    coldVsWarm: categoryBrands.reduce((sum, b) => sum + b.designAxes.coldVsWarm, 0) / categoryBrands.length,
    rigidVsSoft: categoryBrands.reduce((sum, b) => sum + b.designAxes.rigidVsSoft, 0) / categoryBrands.length,
    geometricVsOrganic: categoryBrands.reduce((sum, b) => sum + b.designAxes.geometricVsOrganic, 0) / categoryBrands.length,
    loudVsQuiet: categoryBrands.reduce((sum, b) => sum + b.designAxes.loudVsQuiet, 0) / categoryBrands.length,
  };

  const radarData = [
    { axis: 'Minimal↔Maximal', score: localAxes.minimalVsMaximal, avg: avgAxes.minimalVsMaximal },
    { axis: 'Cold↔Warm', score: localAxes.coldVsWarm, avg: avgAxes.coldVsWarm },
    { axis: 'Rigid↔Soft', score: localAxes.rigidVsSoft, avg: avgAxes.rigidVsSoft },
    { axis: 'Geometric↔Org.', score: localAxes.geometricVsOrganic, avg: avgAxes.geometricVsOrganic },
    { axis: 'Loud↔Quiet', score: localAxes.loudVsQuiet, avg: avgAxes.loudVsQuiet },
  ];

  const axisLabel = (key) => {
    const labels = {
      minimalVsMaximal: 'Minimal ↔ Maximal',
      coldVsWarm: 'Cold ↔ Warm',
      rigidVsSoft: 'Rigid ↔ Soft',
      geometricVsOrganic: 'Geometric ↔ Organic',
      loudVsQuiet: 'Loud ↔ Quiet',
    };
    return labels[key] || key;
  };

  const handleSaveAxes = () => {
    setAxisOverride(brand.brand, localAxes);
    setEditMode(false);
  };

  const handleLoadComparable = (name) => {
    const found = BRAND_DATABASE.find((b) => b.brand.toLowerCase() === name.toLowerCase());
    if (found) {
      setActiveBrand(found);
    } else {
      alert(`"${name}" not in database`);
    }
  };

  const qual = brand.qualitative;

  // Custom tick for Radar chart to show the score at the tip
  const renderCustomTick = ({ payload, x, y, cx, cy, ...rest }) => {
    // We want to append the actual score for the brand to the label text.
    // However, recharts PolarAngleAxis tick doesn't easily expose the data row unless mapped.
    // An alternative is we just render standard text here. 
    // The prompt: "Add axis value labels: show the score number at each axis tip"
    
    const dataPoint = radarData.find(d => d.axis === payload.value);
    const scoreText = dataPoint ? ` (${dataPoint.score})` : '';

    return (
      <text
        {...rest}
        y={y + (y > cy ? 5 : -5)}
        x={x}
        fill="rgba(255,255,255,0.7)"
        fontSize="11"
        fontFamily="Geist Sans"
        textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
      >
        {payload.value}{scoreText}
      </text>
    );
  };

  return (
    <div id="dna-card" className="w-full pb-10">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 style={{ fontFamily: 'General Sans' }} className="text-4xl font-semibold text-white">
            {brand.brand}
          </h2>
          <span className="liquid-glass rounded-full px-3 py-1 text-xs text-white/70 ml-3">
            {brand.category}
          </span>
        </div>

        <div className="flex gap-2">
          {isSaved ? (
            <button className="liquid-glass rounded-full px-3 py-2 text-xs text-white/50 flex items-center gap-1">
              <BookmarkCheck size={14} /> Saved
            </button>
          ) : (
            <button
              onClick={() => saveBrand(brand)}
              className="liquid-glass rounded-full px-3 py-2 text-xs text-white/70 hover:text-white flex items-center gap-1"
            >
              <Bookmark size={14} /> Save
            </button>
          )}
          <button
            onClick={() => addToBenchmark(brand)}
            className="liquid-glass rounded-full px-3 py-2 text-xs text-white/70 hover:text-white flex items-center gap-1"
          >
            <BarChart2 size={14} /> Benchmark
          </button>
          <button
            onClick={() => exportToPDF(brand.brand)}
            className="liquid-glass rounded-full px-3 py-2 text-xs text-white/70 hover:text-white flex items-center gap-1"
          >
            <Download size={14} /> PDF
          </button>
          <button
            onClick={() => exportToJSON(brand)}
            className="liquid-glass rounded-full px-3 py-2 text-xs text-white/70 hover:text-white flex items-center gap-1"
          >
            <FileJson size={14} /> JSON
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`liquid-glass rounded-full px-3 py-2 text-xs flex items-center gap-1 transition-colors ${
              editMode ? 'text-purple-400' : 'text-white/70 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={14} />
            {editMode ? 'Lock Axes' : 'Adjust Axes'}
          </button>
        </div>
      </div>

      {/* TOP SECTION: IMAGE + RADAR */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        
        {/* LEFT: HERO IMAGE PANEL */}
        <div className="w-full lg:w-2/5 shrink-0">
          <BrandImagePanel brand={brand} />
        </div>

        {/* RIGHT: DESIGN AXES RADAR */}
        <div className="w-full lg:w-3/5 glass-panel p-6 flex flex-col justify-between" style={{ height: '320px' }}>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-white font-semibold text-sm">Design Positioning</h3>
            <div className="flex items-center gap-4 text-[10px] text-white/60">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>{brand.brand}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border border-white/40 border-dashed" />
                <span>Category Avg</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-1 items-center gap-6 mt-2">
            {/* RADAR CHART */}
            <div className="flex-1 h-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={renderCustomTick}
                  />
                  <Radar
                    name="Category Average"
                    dataKey="avg"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    fill="rgba(255,255,255,0.2)"
                    fillOpacity={0.1}
                    isAnimationActive={false}
                  />
                  <Radar
                    name={brand.brand}
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="#6366f1"
                    fillOpacity={0.25}
                    isAnimationActive={false}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* AXIS BARS OR EDIT SLIDERS */}
            <div className="w-[45%] flex flex-col justify-center gap-3 border-l border-white/5 pl-6">
              {editMode ? (
                <div className="space-y-4">
                  {Object.entries(localAxes).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3 text-sm">
                      <span className="text-white/60 w-32 text-xs truncate">{axisLabel(key)}</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={val}
                        onChange={(e) =>
                          setLocalAxes({
                            ...localAxes,
                            [key]: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <span className="text-white/80 w-4 text-xs font-mono">{val}</span>
                    </div>
                  ))}
                  <button
                    onClick={handleSaveAxes}
                    className="liquid-glass rounded-full px-4 py-2 text-xs text-white mt-4 w-full hover:bg-white/10 transition-colors"
                  >
                    Save Adjustments
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {radarData.map((d) => (
                    <div key={d.axis} className="flex items-center gap-3 text-xs">
                      <span className="text-white/50 w-28 truncate">{d.axis}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden">
                        <div 
                          className="axis-bar-fill absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${(d.score / 10) * 100}%` }} 
                        />
                      </div>
                      <span className="text-white/80 w-5 text-right font-mono text-[10px]">{d.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THREE DETAIL PANELS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GeometryPanel geo={brand.geometry} />
        <SurfacePanel surf={brand.surfaceLanguage} />
        <CMFPanel brand={brand} />
      </div>

      {/* BOTTOM ROW: QUALITATIVE SYNTHESIS */}
      <div className="glass-panel p-6">
        <h3 className="text-white font-semibold text-sm mb-4">DNA Synthesis</h3>
        <p className="text-sm text-white/80 leading-relaxed mb-6 max-w-4xl">{qual.dnaSummary}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-white/40 block text-xs mb-3">Key Identifiers</span>
            <div className="flex flex-wrap gap-2">
              {qual.designKeywords.map((kw) => (
                <span key={kw} className="liquid-glass rounded-full px-3 py-1 text-xs text-white/70">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-white/40 block text-xs mb-3">Comparable DNA</span>
            <div className="flex flex-wrap gap-2">
              {qual.comparableBrands.map((name) => (
                <button
                  key={name}
                  onClick={() => handleLoadComparable(name)}
                  className="liquid-glass rounded-full px-3 py-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <span className="text-white/40 block text-xs mb-1">Differentiation Signal</span>
              <p className="text-xs text-white/80 leading-snug">{qual.differentiationSignal}</p>
            </div>
            <div>
              <span className="text-white/40 block text-xs mb-1">Era & Trend Positioning</span>
              <p className="text-xs text-white/60 italic leading-snug">{qual.eraTrendPositioning}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
