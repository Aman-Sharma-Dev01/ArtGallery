import React from 'react';
import { 
  Sparkles, 
  Grid, 
  Pin, 
  Moon, 
  Sun, 
  Search, 
  ListFilter,
  Palette,
  Compass
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  totalArtworksCount: number;
  pinnedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  totalArtworksCount,
  pinnedCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f7f2e7]/95 dark:bg-[#181410]/95 backdrop-blur-md border-b border-[#d8c8b0] dark:border-[#2f271d] transition-colors duration-300 shadow-sm">
      <div className="bg-gradient-to-r from-[#8b682e] via-[#d4af37] to-[#8b682e] text-[#1a1208] text-[11px] font-cinzel font-semibold tracking-[0.2em] py-1 text-center uppercase shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>AANCHAL'S ART GALLERY</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div className="flex items-center justify-between gap-2 md:justify-start">
          <div
            onClick={() => onViewChange('gallery')}
            className="cursor-pointer group flex items-center gap-2 min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b6222] p-[2px] shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[#2b1f14] dark:bg-[#120e0a] flex items-center justify-center border border-[#e6cb81]">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37]" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="font-cinzel text-sm sm:text-xl font-bold tracking-tight text-[#3d2b1d] dark:text-[#f3e9d8] flex items-center gap-1.5 truncate">
                AANCHAL'S ART
                <span className="hidden sm:inline text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#e8dbbf] dark:bg-[#2e2318] text-[#8b6222] dark:text-[#d4af37] border border-[#c5a059]/40 uppercase tracking-widest">
                  VINTAGE
                </span>
              </h1>
              <p className="hidden sm:block font-cormorant italic text-xs text-[#705844] dark:text-[#a89582] truncate">
                Personal Digital Painting & Sketch Catalog • {totalArtworksCount} Items
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#eae1d0] dark:bg-[#231b14] p-1 rounded-xl border border-[#d8c8b0] dark:border-[#382b1f] shadow-inner self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => onViewChange('gallery')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-cinzel font-medium transition-all duration-200 whitespace-nowrap ${
              activeView === 'gallery'
                ? 'bg-[#3d2b1d] text-[#f5ebd8] dark:bg-[#d4af37] dark:text-[#17110a] shadow-md font-bold'
                : 'text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc] dark:hover:bg-[#2e2319]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => onViewChange('pinterest')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-cinzel font-medium transition-all duration-200 whitespace-nowrap ${
              activeView === 'pinterest'
                ? 'bg-[#3d2b1d] text-[#f5ebd8] dark:bg-[#d4af37] dark:text-[#17110a] shadow-md font-bold'
                : 'text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc] dark:hover:bg-[#2e2319]'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Pins ({pinnedCount})</span>
          </button>

          <button
            onClick={() => onViewChange('exhibition3d')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-cinzel font-medium transition-all duration-200 whitespace-nowrap ${
              activeView === 'exhibition3d'
                ? 'bg-[#8b261d] text-[#fce8e6] dark:bg-[#e05244] dark:text-[#1a0806] shadow-md font-bold animate-pulse'
                : 'text-[#8b261d] dark:text-[#e05244] hover:bg-[#f2dbd9] dark:hover:bg-[#2d1513]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>

          <button
            onClick={() => onViewChange('catalog')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-cinzel font-medium transition-all duration-200 whitespace-nowrap ${
              activeView === 'catalog'
                ? 'bg-[#3d2b1d] text-[#f5ebd8] dark:bg-[#d4af37] dark:text-[#17110a] shadow-md font-bold'
                : 'text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc] dark:hover:bg-[#2e2319]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Index</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="relative flex-1 min-w-[120px] sm:w-52 sm:min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c735d] dark:text-[#99836f]" />
            <input
              type="text"
              placeholder="Search art"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-[11px] sm:text-xs bg-[#efea3f]/10 dark:bg-[#241d17] border border-[#d8c8b0] dark:border-[#3a2e22] rounded-lg text-[#3d2b1d] dark:text-[#f3e9d8] placeholder-[#947e6a] dark:placeholder-[#7a6857] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8c735d] hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg bg-[#eae1d0] dark:bg-[#231b14] border border-[#d8c8b0] dark:border-[#382b1f] text-[#614b38] dark:text-[#d4af37] hover:scale-105 transition-all duration-200"
            title={isDarkMode ? 'Switch to Light Gallery Mode' : 'Dim Gallery Lights (Dark Mode)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#ffd700]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
