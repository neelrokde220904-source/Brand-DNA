import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

export default function CMFPanel({ brand }) {
  const cmf = brand.cmf;
  const [copiedHex, setCopiedHex] = useState(null);

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Palette Gradient Builder
  const buildGradient = (colors) => {
    if (!colors || colors.length === 0) return 'transparent';
    if (colors.length === 1) return colors[0];
    const step = 100 / (colors.length - 1);
    const stops = colors.map((c, i) => `${c} ${i * step}%`).join(', ');
    return `linear-gradient(90deg, ${stops})`;
  };

  // Texture CSS Builder
  const getTextureStyle = (textureName) => {
    switch (textureName) {
      case 'brushed-metal':
        return {
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px), linear-gradient(180deg, #666 0%, #999 50%, #666 100%)'
        };
      case 'anodized':
        return {
          background: 'linear-gradient(135deg, #2a2a2a 0%, #555 50%, #1a1a1a 100%)',
          filter: 'contrast(1.1) brightness(0.9)' // simple noise approx
        };
      case 'polished':
        return {
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4), rgba(200,200,200,0.1) 50%, #888)'
        };
      case 'matte-plastic':
        return {
          background: '#2d2d2d',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
        };
      case 'soft-touch':
        return {
          background: '#1a1a1a'
          // A proper SVG noise filter would be attached here if needed, keeping it simple for CSS
        };
      case 'woven-fabric':
        return {
          background: 'repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px'
        };
      case 'leather':
        return {
          background: '#5c3a1e'
          // simple leather approx
        };
      case 'raw-wood':
        return {
          background: 'repeating-linear-gradient(10deg, #8B6914 0px, #A07820 2px, #7A5C10 4px, #8B6914 6px)'
        };
      case 'glass':
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        };
      case 'rubber':
        return {
          background: '#1a1a1a',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        };
      case 'ceramic':
        return {
          background: 'radial-gradient(ellipse at 20% 20%, #f0f0f0, #d0d0d0)'
        };
      default:
        return { background: '#333' };
    }
  };

  // Tactility Badge Styling
  const getTactilityStyle = (tact) => {
    const t = tact.toLowerCase();
    if (t.includes('cold')) return 'bg-blue-900/40 text-blue-200 border border-blue-700/30';
    if (t.includes('warm')) return 'bg-orange-900/40 text-orange-200 border border-orange-700/30';
    if (t.includes('premium')) return 'bg-violet-900/40 text-violet-200 border border-violet-700/30';
    return 'bg-zinc-800/60 text-zinc-300 border border-zinc-600/30'; // neutral
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 text-white">
        <Palette size={14} /> <span className="font-semibold text-sm">CMF Direction</span>
      </div>

      <div className="space-y-4 flex-1">
        {/* Palettes */}
        <div>
          <span className="text-white/40 block text-xs mb-1.5">Primary Palette</span>
          <div 
            className="w-full h-12 rounded-[10px] mb-2 border border-white/10"
            style={{ background: buildGradient(cmf.primaryPalette) }}
          />
          <div className="flex gap-2">
            {cmf.primaryPalette.map(hex => (
              <button
                key={hex}
                onClick={() => copyToClipboard(hex)}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 rounded-full px-2 py-1 transition-colors border border-white/5"
              >
                <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                <span className="text-[10px] text-white/60 font-mono">
                  {copiedHex === hex ? 'Copied' : hex}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-white/40 block text-xs mb-1.5">Accent Palette</span>
          <div 
            className="w-full h-7 rounded-md mb-2 border border-white/10"
            style={{ background: buildGradient(cmf.accentPalette) }}
          />
          <div className="flex gap-2">
            {cmf.accentPalette.map(hex => (
              <button
                key={hex}
                onClick={() => copyToClipboard(hex)}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 rounded-full px-2 py-1 transition-colors border border-white/5"
              >
                <div className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                <span className="text-[10px] text-white/60 font-mono">
                  {copiedHex === hex ? 'Copied' : hex}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Material Texture & Details Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-2">
          {/* Swatch */}
          <div>
            <span className="text-white/40 block text-xs mb-2">Texture Swatch</span>
            <div 
              className="w-20 h-20 rounded-xl border border-white/20 mb-1"
              style={getTextureStyle(brand.materialTextureSwatch)}
            />
            <span className="text-[10px] text-white/50 capitalize block mt-1">
              {brand.materialTextureSwatch?.replace('-', ' ')}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-white/40 block text-xs mb-1">Hero Material</span>
              <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 inline-block">
                {cmf.heroMaterial}
              </span>
            </div>
            <div>
              <span className="text-white/40 block text-xs mb-1">Finish Type</span>
              <span className="text-xs text-white/90 leading-tight block">{cmf.finishType}</span>
            </div>
            <div>
              <span className="text-white/40 block text-xs mb-1">Tactility</span>
              <span className={`px-2.5 py-1 rounded-md text-xs inline-block ${getTactilityStyle(cmf.tactility)}`}>
                {cmf.tactility}
              </span>
            </div>
          </div>
        </div>

        {/* Color Temperature Gauge */}
        <div className="border-t border-white/5 pt-4">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-white/40 text-xs">Color Temperature</span>
            <div className="flex gap-2 text-[10px] text-white/50">
              <span>Cold</span>
              <span>Warm</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full relative bg-gradient-to-r from-[#4fc3f7] via-white/20 to-[#ff7043] border border-white/10">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white bg-black shadow-lg"
              style={{ left: `${(brand.colorTemperature / 10) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
