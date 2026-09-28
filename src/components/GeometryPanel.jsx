import React from 'react';
import { Hexagon, Box } from 'lucide-react';

export default function GeometryPanel({ geo }) {
  // Corner Radius Mapping
  const getRadiusIndex = (val) => {
    if (val <= 2) return 0;
    if (val <= 5) return 1;
    if (val <= 8) return 2;
    return 3;
  };
  const activeRadiusIndex = getRadiusIndex(geo.cornerRadiusIndex);
  const radii = [0, 4, 12, 14]; // sharp -> soft -> round -> pill (14 is pill-ish for 28x28)

  // Edge Tension Badge Styling
  const getEdgeTensionStyle = (tension) => {
    switch (tension) {
      case 'hard': return 'bg-blue-500/10 text-blue-300 border border-blue-500/20';
      case 'soft': return 'bg-violet-500/10 text-violet-300 border border-violet-500/20';
      case 'compound': return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
      case 'mixed':
      default: return 'bg-white/10 text-white/70 border border-white/10';
    }
  };

  // Symmetry SVG
  const renderSymmetry = (type) => {
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" style={{ stroke: 'rgba(255,255,255,0.4)', fill: 'none', strokeWidth: 1.5 }}>
        {type === 'bilateral' && (
          <g>
            <rect x="15" y="15" width="30" height="30" rx="4" strokeDasharray="2 2" />
            <line x1="30" y1="5" x2="30" y2="55" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          </g>
        )}
        {type === 'radial' && (
          <g>
            <circle cx="30" cy="30" r="16" strokeDasharray="2 2" />
            <line x1="30" y1="5" x2="30" y2="55" stroke="rgba(255,255,255,0.6)" />
            <line x1="5" y1="30" x2="55" y2="30" stroke="rgba(255,255,255,0.6)" />
            <line x1="12" y1="12" x2="48" y2="48" stroke="rgba(255,255,255,0.6)" />
            <line x1="12" y1="48" x2="48" y2="12" stroke="rgba(255,255,255,0.6)" />
          </g>
        )}
        {type === 'asymmetric' && (
          <polygon points="20,10 50,25 40,50 10,40" stroke="rgba(255,255,255,0.8)" />
        )}
        {type === 'variable' && (
          <g strokeDasharray="3 3" stroke="rgba(255,255,255,0.6)">
            <rect x="15" y="15" width="30" height="30" rx="4" />
            <line x1="30" y1="10" x2="30" y2="50" />
            <line x1="10" y1="30" x2="50" y2="30" />
          </g>
        )}
      </svg>
    );
  };

  // Proportion Visualization
  const renderProportion = (ratioText) => {
    let w = 1, h = 1;
    const text = ratioText.toLowerCase();
    if (text.includes('golden')) { w = 1.618; h = 1; }
    else if (text.includes('16:9')) { w = 16; h = 9; }
    else if (text.includes('3:2')) { w = 3; h = 2; }
    else if (text.includes('2:3')) { w = 2; h = 3; }
    else if (text.includes('1:3')) { w = 1; h = 3; }
    else if (text.includes('4:3')) { w = 4; h = 3; }
    else if (text.includes('square')) { w = 1; h = 1; }
    else if (text.includes('tall')) { w = 1; h = 2.5; }
    else if (text.includes('wide')) { w = 2.5; h = 1; }
    else { w = 3; h = 2; } // fallback

    // Scale to fit max 80x40 area roughly
    const scale = Math.min(80 / w, 40 / h);
    const boxW = w * scale;
    const boxH = h * scale;

    return (
      <div 
        style={{ 
          width: boxW, 
          height: boxH, 
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.05)'
        }} 
      />
    );
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 text-white">
        <Hexagon size={14} /> <span className="font-semibold text-sm">Geometry</span>
      </div>
      
      <div className="space-y-4 flex-1">
        {/* Silhouette Type */}
        <div className="flex gap-3">
          <div className="text-white/40 mt-0.5"><Box size={16} /></div>
          <div>
            <span className="text-white/40 block text-xs mb-1">Silhouette Type</span>
            <span className="text-white/90 text-sm leading-snug block">{geo.silhouetteType}</span>
          </div>
        </div>

        {/* Symmetry and Proportion Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-white/40 block text-xs mb-2">Symmetry</span>
            <div className="flex items-center gap-2">
              {renderSymmetry(geo.symmetryAxis)}
              <span className="text-xs text-white/60 capitalize">{geo.symmetryAxis}</span>
            </div>
          </div>
          <div>
            <span className="text-white/40 block text-xs mb-2">Proportions</span>
            <div className="flex items-center h-[60px]">
              {renderProportion(geo.proportionRatio)}
            </div>
          </div>
        </div>

        {/* Edge Tension & Corner Radius */}
        <div className="flex items-end justify-between border-t border-white/5 pt-4 mt-2">
          <div>
            <span className="text-white/40 block text-xs mb-2">Edge Tension</span>
            <span className={`px-2.5 py-1 rounded-md text-xs ${getEdgeTensionStyle(geo.edgeTension)}`}>
              {geo.edgeTension}
            </span>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/40 text-xs">Corner Radius</span>
              <span className="text-xs text-white/60 font-mono">{geo.cornerRadiusIndex}/10</span>
            </div>
            <div className="flex gap-1.5">
              {radii.map((r, i) => {
                const isActive = activeRadiusIndex === i;
                return (
                  <div 
                    key={i}
                    style={{ 
                      width: 28, height: 28, 
                      borderRadius: r, 
                      border: `1.5px solid ${isActive ? '#6366f1' : 'rgba(255,255,255,0.2)'}`,
                      background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent'
                    }} 
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
      
      <p className="text-xs text-white/50 italic mt-4 leading-relaxed border-t border-white/10 pt-3">
        "{geo.geometryNarrative}"
      </p>
    </div>
  );
}
