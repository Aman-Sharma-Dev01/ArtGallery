import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pin, Eye, Sparkles, Tag, Maximize2, Layers } from 'lucide-react';
import { Artwork } from '../types';
import { createArtCanvasFallback } from '../data/initialArtworks';

interface ArtworkCardProps {
  artwork: Artwork;
  onInspect: (artwork: Artwork) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onInspect,
  onTogglePin
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getFrameClass = () => {
    switch (artwork.frameType) {
      case 'gold':
        return 'vintage-gold-frame';
      case 'wood':
        return 'vintage-wood-frame';
      case 'ebony':
        return 'border-[8px] solid #151515 outline outline-1 outline-[#d4af37] shadow-xl';
      case 'ornate':
        return 'border-[10px] solid #4d3826 outline outline-1 outline-[#e6c687] shadow-2xl';
      default:
        return 'vintage-gold-frame';
    }
  };

  const fallbackUrl = createArtCanvasFallback(
    artwork.serialNumber, 
    artwork.title, 
    artwork.category, 
    '#3d2b1d', 
    '#d4af37'
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-[#f7f3e9] dark:bg-[#1a1612] rounded-xl border border-[#dcd0bc] dark:border-[#2b231b] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Frame Container */}
      <div className="p-3 bg-[#ebe2d0] dark:bg-[#14110e]">
        <div 
          onClick={() => onInspect(artwork)}
          className={`relative cursor-pointer frame-shine rounded ${getFrameClass()} overflow-hidden transition-all duration-300`}
        >
          <div className="vintage-matting relative">
            <div className="relative aspect-[4/5] bg-[#221c16] rounded overflow-hidden flex items-center justify-center">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-shimmer flex items-center justify-center text-xs text-[#8c735d] font-cinzel animate-pulse">
                  Loading...
                </div>
              )}

              <img
                src={imageError ? fallbackUrl : artwork.imageUrl}
                alt={artwork.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />

              {/* Minimal Pin Button */}
              <button
                onClick={(e) => onTogglePin(artwork.id, e)}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                  artwork.isPinned
                    ? 'bg-rose-600 text-white scale-105 shadow-md'
                    : 'bg-black/40 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100'
                }`}
                title={artwork.isPinned ? 'Saved to board' : 'Save to board'}
              >
                <Pin className={`w-3.5 h-3.5 ${artwork.isPinned ? 'fill-current' : ''}`} />
              </button>

              {/* Hover Inspect Indicator */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-black/70 text-[#f5ebd8] font-cinzel text-xs flex items-center gap-1.5 backdrop-blur-sm border border-[#d4af37]/40">
                  <Maximize2 className="w-3 h-3 text-[#d4af37]" /> Inspect
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
