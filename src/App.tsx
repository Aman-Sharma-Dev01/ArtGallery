import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ArtworkCard } from './components/ArtworkCard';
import { PinterestLayout } from './components/PinterestLayout';
import { Virtual3DExhibition } from './components/Virtual3DExhibition';
import { CatalogListView } from './components/CatalogListView';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { Artwork, Board, Category, ViewMode, ExhibitionSettings } from './types';
import { 
  loadStoredArtworks, 
  saveArtworksToStorage, 
  loadStoredBoards, 
  saveBoardsToStorage,
  loadExhibitionSettings,
  saveExhibitionSettings 
} from './utils/storage';
import { Sparkles, Palette, Filter, Compass, Grid, Pin } from 'lucide-react';

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>(() => loadStoredArtworks());
  const [boards, setBoards] = useState<Board[]>(() => loadStoredBoards());
  const [exhibitionSettings, setExhibitionSettings] = useState<ExhibitionSettings>(() => loadExhibitionSettings());
  
  const [activeView, setActiveView] = useState<ViewMode>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('aanchal_gallery_dark_mode') === 'true';
  });

  const [inspectedArtwork, setInspectedArtwork] = useState<Artwork | null>(null);
  const [is3DImmersiveMode, setIs3DImmersiveMode] = useState(false);

  // Sync Dark Mode to HTML document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aanchal_gallery_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aanchal_gallery_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Persist artworks
  useEffect(() => {
    saveArtworksToStorage(artworks);
  }, [artworks]);

  // Persist boards
  useEffect(() => {
    saveBoardsToStorage(boards);
  }, [boards]);

  // Persist exhibition settings
  useEffect(() => {
    saveExhibitionSettings(exhibitionSettings);
  }, [exhibitionSettings]);

  useEffect(() => {
    if (activeView !== 'exhibition3d') {
      setIs3DImmersiveMode(false);
    }
  }, [activeView]);

  useEffect(() => {
    const shouldLockScroll = activeView === 'exhibition3d' && is3DImmersiveMode;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeView, is3DImmersiveMode]);

  // Toggle Pin Status
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArtworks(prev => prev.map(art => {
      if (art.id === id) {
        return { ...art, isPinned: !art.isPinned };
      }
      return art;
    }));
  };

  // Update Artwork
  const handleUpdateArtwork = (updated: Artwork) => {
    setArtworks(prev => prev.map(art => art.id === updated.id ? updated : art));
    setInspectedArtwork(updated);
  };

  // Create Pinterest Board
  const handleCreateBoard = (name: string, description: string) => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBoards(prev => [...prev, newBoard]);
  };

  // Assign Artwork to Board
  const handleAssignBoard = (artworkId: string, boardId: string) => {
    setArtworks(prev => prev.map(art => {
      if (art.id === artworkId) {
        return { ...art, boardId, isPinned: true };
      }
      return art;
    }));
  };

  // Filter artworks by category and search query
  const filteredArtworks = artworks.filter(art => {
    // Category check
    if (selectedCategory !== 'All' && art.category !== selectedCategory) {
      return false;
    }
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSerial = art.serialNumber.includes(q) || art.filename.toLowerCase().includes(q);
      const matchDesc = art.description.toLowerCase().includes(q);
      const matchTags = art.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchSerial || matchDesc || matchTags;
    }
    return true;
  });

  const categoriesList: Category[] = [
    'All',
    'Digital Painting',
    'Sketch',
    'Oil Study',
    'Watercolor',
    'Concept Art',
    'Charcoal'
  ];

  const pinnedCount = artworks.filter(a => a.isPinned).length;

  return (
    <div className="min-h-screen bg-parchment transition-colors duration-300 flex flex-col font-sans">
      {/* Header */}
      {!(activeView === 'exhibition3d' && is3DImmersiveMode) && (
        <Header
          activeView={activeView}
          onViewChange={setActiveView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          totalArtworksCount={artworks.length}
          pinnedCount={pinnedCount}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Museum Hero Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#efe7d6] via-[#f7f2e7] to-[#efe7d6] dark:from-[#1d1610] dark:via-[#241c14] dark:to-[#1d1610] border border-[#d8c8b0] dark:border-[#33271b] shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#8b6222] dark:text-[#d4af37] text-xs font-cinzel font-bold tracking-widest uppercase mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>CURATED PERSONAL DIGITAL ART & SKETCHBOOK</span>
                  </div>
                  <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#3d2b1d] dark:text-[#f3e9d8] leading-tight">
                    The Grand Salon Gallery
                  </h2>
                  <p className="font-cormorant italic text-base sm:text-lg text-[#6e5642] dark:text-[#b8a695] mt-1 max-w-2xl">
                    Browse Aanchal's digital paintings, charcoal figure studies, and watercolors framed in antique gold and carved mahogany.
                  </p>
                </div>

                {/* Quick Stats Pill */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl bg-[#eae1ce] dark:bg-[#2b2117] border border-[#d8c8b0] dark:border-[#3d2f21] text-center">
                    <span className="block font-cinzel font-bold text-xl text-[#3d2b1d] dark:text-[#d4af37]">
                      {artworks.length}
                    </span>
                    <span className="text-[10px] font-sans text-[#705844] dark:text-[#a89582] uppercase font-semibold">
                      Archived Files
                    </span>
                  </div>

                  <div className="px-4 py-2.5 rounded-2xl bg-[#eae1ce] dark:bg-[#2b2117] border border-[#d8c8b0] dark:border-[#3d2f21] text-center">
                    <span className="block font-cinzel font-bold text-xl text-rose-600 dark:text-rose-400">
                      {pinnedCount}
                    </span>
                    <span className="text-[10px] font-sans text-[#705844] dark:text-[#a89582] uppercase font-semibold">
                      Pinned
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-cinzel font-bold text-[#705844] dark:text-[#d4af37] flex items-center gap-1.5 pr-2">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-cinzel font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#3d2b1d] text-[#f5ebd8] dark:bg-[#d4af37] dark:text-[#120e0a] shadow-md font-bold'
                      : 'bg-[#eae1ce] dark:bg-[#231d17] text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc] dark:hover:bg-[#2e2319]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {filteredArtworks.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-cinzel text-lg text-[#705844] dark:text-[#a89582]">
                  No artworks matched your search query.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#3d2b1d] dark:bg-[#d4af37] text-[#f5ebd8] dark:text-[#120e0a] text-xs font-cinzel font-bold"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredArtworks.map(art => (
                  <ArtworkCard
                    key={art.id}
                    artwork={art}
                    onInspect={setInspectedArtwork}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pinterest Layout View */}
        {activeView === 'pinterest' && (
          <PinterestLayout
            artworks={artworks}
            boards={boards}
            onInspect={setInspectedArtwork}
            onTogglePin={handleTogglePin}
            onCreateBoard={handleCreateBoard}
            onAssignBoard={handleAssignBoard}
          />
        )}

        {/* 3D Virtual Exhibition View */}
        {activeView === 'exhibition3d' && (
          <Virtual3DExhibition
            artworks={artworks}
            onInspect={setInspectedArtwork}
            settings={exhibitionSettings}
            onUpdateSettings={setExhibitionSettings}
            isImmersiveMode={is3DImmersiveMode}
            onToggleImmersiveMode={() => setIs3DImmersiveMode(prev => !prev)}
          />
        )}

        {/* Serial Catalog List View */}
        {activeView === 'catalog' && (
          <CatalogListView
            artworks={artworks}
            onInspect={setInspectedArtwork}
            onTogglePin={handleTogglePin}
          />
        )}
      </main>

      {/* Footer */}
      {!(activeView === 'exhibition3d' && is3DImmersiveMode) && (
      <footer className="mt-12 bg-[#eae1ce] dark:bg-[#15110d] border-t border-[#d8c8b0] dark:border-[#2f271d] py-6 text-center text-xs text-[#705844] dark:text-[#a08f7d] font-cormorant italic">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Aanchal’s Personal Art Archives. All digital paintings & sketches cataloged.</p>
          <div className="flex items-center gap-4 font-cinzel not-italic text-[11px] text-[#8b6222] dark:text-[#d4af37]">
            <span>Archival Standard: High-Res 4K</span>
            <span>•</span>
            <span>Pure Frontend Architecture</span>
          </div>
        </div>
      </footer>
      )}

      {/* Modals */}
      <ArtworkDetailModal
        artwork={inspectedArtwork}
        onClose={() => setInspectedArtwork(null)}
        onTogglePin={handleTogglePin}
        onUpdateArtwork={handleUpdateArtwork}
      />


    </div>
  );
}
