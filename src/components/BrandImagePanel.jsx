import React, { useState, useEffect } from 'react';

const FormArchetypeSVG = ({ archetype, edgeTension, cornerRadiusIndex }) => {
  const renderShape = () => {
    switch (archetype) {
      case 'rectangle':
        return <rect x="40" y="60" width="120" height="80" rx="0" />;
      case 'rounded-rectangle':
        return <rect x="40" y="60" width="120" height="80" rx={cornerRadiusIndex * 4} />;
      case 'oval':
        return <ellipse cx="100" cy="100" rx="70" ry="45" />;
      case 'L-shape':
        return <path d="M40,40 L40,160 L120,160 L120,120 L80,120 L80,40 Z" />;
      case 'wedge':
        return <polygon points="40,160 160,160 130,60" />;
      case 'cylinder':
        return (
          <g>
            <ellipse cx="100" cy="60" rx="40" ry="15" />
            <path d="M60,60 L60,140 A40,15 0 0,0 140,140 L140,60" fill="none" />
          </g>
        );
      case 'blob':
        return <path d="M60,100 C50,50 140,40 140,90 C140,150 90,160 70,140 C50,120 70,150 60,100 Z" />;
      case 'slab':
        return <rect x="30" y="50" width="140" height="100" rx="8" />;
      case 'trapezoid':
        return <polygon points="60,150 140,150 160,60 40,60" />;
      default:
        return <rect x="40" y="60" width="120" height="80" rx={cornerRadiusIndex * 2} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <svg
        viewBox="0 0 200 200"
        className="w-40 h-40"
        style={{
          stroke: 'rgba(255,255,255,0.6)',
          strokeWidth: 1.5,
          fill: 'rgba(255,255,255,0.04)',
        }}
      >
        {renderShape()}
      </svg>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-white/70 text-xs capitalize">{archetype?.replace('-', ' ')}</span>
        <span className="liquid-glass px-2 py-0.5 rounded text-[10px] text-white/50">{edgeTension}</span>
      </div>
    </div>
  );
};

export default function BrandImagePanel({ brand }) {
  const images = brand.images || {};
  const [activeImage, setActiveImage] = useState(images.hero);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setActiveImage(images.hero);
    setImageError(false);
  }, [brand]);

  const hasImage = activeImage && !imageError;

  return (
    <div className="glass-panel overflow-hidden relative" style={{ height: '320px' }}>
      {hasImage ? (
        <>
          <img
            src={activeImage}
            alt={brand.brand}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <FormArchetypeSVG
            archetype={brand.formArchetypeShape}
            edgeTension={brand.geometry.edgeTension}
            cornerRadiusIndex={brand.geometry.cornerRadiusIndex}
          />
        </div>
      )}

      {/* Top-right thumbnails */}
      {(images.product1 || images.product2) && hasImage && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {images.hero && activeImage !== images.hero && (
            <img
              src={images.hero}
              alt="Hero"
              className="w-16 h-16 rounded-lg object-cover border border-white/20 cursor-pointer hover:border-white/60 transition-colors bg-black/50"
              onClick={() => setActiveImage(images.hero)}
            />
          )}
          {images.product1 && activeImage !== images.product1 && (
            <img
              src={images.product1}
              alt="Product 1"
              className="w-16 h-16 rounded-lg object-cover border border-white/20 cursor-pointer hover:border-white/60 transition-colors bg-black/50"
              onClick={() => setActiveImage(images.product1)}
            />
          )}
          {images.product2 && activeImage !== images.product2 && (
            <img
              src={images.product2}
              alt="Product 2"
              className="w-16 h-16 rounded-lg object-cover border border-white/20 cursor-pointer hover:border-white/60 transition-colors bg-black/50"
              onClick={() => setActiveImage(images.product2)}
            />
          )}
        </div>
      )}

      {/* Bottom overlay content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between z-10">
        <div>
          {images.logoUrl && (
            <img src={images.logoUrl} alt="Logo" className="h-8 mb-3 object-contain opacity-90 brightness-0 invert" />
          )}
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'General Sans' }}>{brand.brand}</h3>
            <span className="liquid-glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/80 border border-white/10">
              {brand.category}
            </span>
          </div>
        </div>
        
        {/* Color Temp Indicator */}
        {hasImage && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-white/50 uppercase tracking-widest">Color Temp</span>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i < brand.colorTemperature ? 'bg-white/80' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
