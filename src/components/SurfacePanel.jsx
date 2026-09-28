import React from 'react';
import { Layers } from 'lucide-react';

export default function SurfacePanel({ surf }) {
  // Density Grid Rendering
  const renderDensityGrid = (score) => {
    return (
      <div className="grid grid-cols-5 gap-1.5 w-fit">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < score ? 'bg-indigo-500' : 'bg-white/10'}`}
          />
        ))}
      </div>
    );
  };

  // Seam Philosophy SVG
  const renderSeamPhilosophy = (philosophy) => {
    return (
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ stroke: 'rgba(255,255,255,0.5)', fill: 'none', strokeWidth: 1.5 }}>
        {philosophy === 'hidden' && (
          <path d="M10,30 Q40,10 70,30" />
        )}
        {philosophy === 'exposed' && (
          <g>
            <path d="M10,30 Q35,15 38,20" />
            <path d="M42,20 Q45,15 70,30" />
          </g>
        )}
        {philosophy === 'decorative' && (
          <g>
            <path d="M10,30 Q40,10 70,30" />
            <path d="M40,15 L40,22" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          </g>
        )}
        {philosophy === 'functional' && (
          <g>
            <path d="M10,30 Q38,12 40,25" />
            <path d="M40,25 Q42,12 70,30" />
            <path d="M40,5 L40,15" stroke="rgba(255,255,255,0.8)" strokeWidth="1" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.8)" />
              </marker>
            </defs>
          </g>
        )}
        {/* fallback if none matched perfectly */}
        {!['hidden', 'exposed', 'decorative', 'functional'].includes(philosophy) && (
          <path d="M10,30 Q40,10 70,30" />
        )}
      </svg>
    );
  };

  // Graphic Integration Badge Styling
  const getGraphicBadgeStyle = (graphic) => {
    const g = graphic.toLowerCase();
    if (g.includes('embedded')) return 'bg-indigo-900/40 text-indigo-200 border border-indigo-700/30';
    if (g.includes('applied')) return 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/30';
    if (g.includes('minimal')) return 'bg-zinc-800/60 text-zinc-300 border border-zinc-600/30';
    return 'bg-transparent text-white/50 border border-white/10 border-dashed'; // 'none'
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 text-white">
        <Layers size={14} /> <span className="font-semibold text-sm">Surface Language</span>
      </div>

      <div className="space-y-4 flex-1">
        {/* Detail Density */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white/40 block text-xs mb-1">Detail Density</span>
            <span className="text-xs text-white/80 font-mono">{surf.detailDensity}/10</span>
          </div>
          {renderDensityGrid(surf.detailDensity)}
        </div>

        {/* Line Logic & Affordance Text */}
        <div>
          <span className="text-white/40 block text-xs mb-1">Line Logic</span>
          <span className="text-white/90 text-sm leading-snug block">{surf.lineLogic}</span>
        </div>
        <div>
          <span className="text-white/40 block text-xs mb-1">Affordance</span>
          <span className="text-white/90 text-sm leading-snug block">{surf.affordanceLanguage}</span>
        </div>

        {/* Seam Philosophy & Graphics Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-2">
          <div>
            <span className="text-white/40 block text-xs mb-2">Seam Philosophy</span>
            <div className="flex flex-col gap-1">
              {renderSeamPhilosophy(surf.seamPhilosophy)}
              <span className="text-xs text-white/80 capitalize">{surf.seamPhilosophy}</span>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-white/40 block text-xs mb-2">Graphic Integration</span>
              <span className={`px-2.5 py-1 rounded-md text-xs inline-block ${getGraphicBadgeStyle(surf.graphicIntegration)}`}>
                {surf.graphicIntegration}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/50 italic mt-4 leading-relaxed border-t border-white/10 pt-3">
        "{surf.surfaceNarrative}"
      </p>
    </div>
  );
}
