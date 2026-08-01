import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, Plus, Bookmark, FolderHeart, ExternalLink, Heart, Sparkles, Filter, Maximize2 } from 'lucide-react';
import { Artwork, Board } from '../types';

interface PinterestLayoutProps {
  artworks: Artwork[];
  boards: Board[];
  onInspect: (artwork: Artwork) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onCreateBoard: (name: string, description: string) => void;
  onAssignBoard: (artworkId: string, boardId: string) => void;
}

export const PinterestLayout: React.FC<PinterestLayoutProps> = ({
  artworks,
  boards,
  onInspect,
  onTogglePin,
  onCreateBoard,
  onAssignBoard
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('all');
  const [showOnlyPinned, setShowOnlyPinned] = useState<boolean>(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  // Filter artworks based on board and pin filter
  const filteredArtworks = artworks.filter(art => {
    if (showOnlyPinned && !art.isPinned) return false;
    if (selectedBoardId === 'all') return true;
    if (selectedBoardId === 'pinned') return art.isPinned;
    return art.boardId === selectedBoardId;
  });

  const handleBoardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    onCreateBoard(newBoardName.trim(), newBoardDesc.trim());
    setNewBoardName('');
    setNewBoardDesc('');
    setIsCreatingBoard(false);
  };

  return (
    <div className="min-h-screen py-3 px-3 sm:py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 bg-[#f5f0e3] dark:bg-[#1a1612] p-4 sm:p-6 rounded-2xl border border-[#dcd0bc] dark:border-[#2e261e] shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#c5a059] text-[10px] sm:text-xs font-cinzel font-bold tracking-widest uppercase mb-1">
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>SAVED MOODBOARDS & INSPIRATIONS</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">
              Saved Collections
            </h2>
            <p className="hidden sm:block font-cormorant italic text-sm text-[#705844] dark:text-[#a89582] mt-1">
              Organize your digital paintings, charcoal sketches, and color studies into custom moodboards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowOnlyPinned(!showOnlyPinned)}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-cinzel font-bold transition-all ${
                showOnlyPinned
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-[#eae1ce] dark:bg-[#282018] text-[#523d2b] dark:text-[#d4af37] border border-[#d8c8b0] dark:border-[#382b1f]'
              }`}
            >
              <Pin className="w-3.5 h-3.5 fill-current" />
              <span>{showOnlyPinned ? 'Showing Pinned' : 'Filter Saved Pins'}</span>
            </button>

            <button
              onClick={() => setIsCreatingBoard(true)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#3d2b1d] dark:bg-[#d4af37] text-[#f5ebd8] dark:text-[#120e0a] text-[10px] sm:text-xs font-cinzel font-bold shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>New Board</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#e2d6c3] dark:border-[#2b231b] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
          <button
            onClick={() => setSelectedBoardId('all')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-cinzel font-semibold whitespace-nowrap transition-all ${
              selectedBoardId === 'all'
                ? 'bg-[#3d2b1d] text-[#f5ebd8] dark:bg-[#d4af37] dark:text-[#17110a] shadow-md'
                : 'bg-[#ebe2d0] dark:bg-[#231d17] text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc]'
            }`}
          >
            All Pins ({artworks.length})
          </button>

          <button
            onClick={() => setSelectedBoardId('pinned')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-cinzel font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedBoardId === 'pinned'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-[#ebe2d0] dark:bg-[#231d17] text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc]'
            }`}
          >
            <Pin className="w-3 h-3 text-rose-500 fill-rose-500" />
            Starred ({artworks.filter(a => a.isPinned).length})
          </button>

          {boards.map(board => {
            const count = artworks.filter(a => a.boardId === board.id).length;
            return (
              <button
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-cinzel font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedBoardId === board.id
                    ? 'bg-[#3d2b1d] text-[#f5ebd8] dark:bg-[#d4af37] dark:text-[#17110a] shadow-md'
                    : 'bg-[#ebe2d0] dark:bg-[#231d17] text-[#614b38] dark:text-[#ba9d84] hover:bg-[#dfd3bc]'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{board.name}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* New Board Modal */}
      <AnimatePresence>
        {isCreatingBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#f7f2e7] dark:bg-[#1a1612] p-6 rounded-2xl border border-[#d4af37] max-w-md w-full shadow-2xl"
            >
              <h3 className="font-cinzel text-xl font-bold text-[#3d2b1d] dark:text-[#f3e9d8] mb-1">
                Create Pinterest Moodboard
              </h3>
              <p className="text-xs text-[#705844] dark:text-[#a89582] font-cormorant italic mb-4">
                Group related serial artworks or study themes into a dedicated board.
              </p>

              <form onSubmit={handleBoardSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                    Board Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Renaissance Anatomy & Charcoal"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief curator notes for this inspiration board..."
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingBoard(false)}
                    className="px-4 py-2 text-xs font-cinzel font-semibold text-[#705844] dark:text-[#a89582] hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3d2b1d] dark:bg-[#d4af37] text-[#f5ebd8] dark:text-[#17110a] text-xs font-cinzel font-bold rounded-xl shadow-md"
                  >
                    Create Board
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry Pin Layout Grid */}
      {filteredArtworks.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <Sparkles className="w-12 h-12 text-[#c5a059] mx-auto mb-3 animate-bounce" />
          <h3 className="font-cinzel text-xl font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">
            No Pins Found
          </h3>
          <p className="font-cormorant italic text-sm text-[#705844] dark:text-[#a89582] mt-1">
            Try selecting a different board or pin artworks from the Museum Salon gallery.
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {filteredArtworks.map((art) => (
            <motion.div
              key={art.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-3 break-inside-avoid group relative bg-[#f5f0e3] dark:bg-[#1a1612] rounded-2xl overflow-hidden border border-[#dcd0bc] dark:border-[#2e261e] shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container */}
              <div 
                onClick={() => onInspect(art)}
                className="relative cursor-pointer overflow-hidden"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Minimal Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex items-start justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspect(art);
                    }}
                    className="px-3 py-1.5 rounded-full bg-black/70 text-[#f5ebd8] text-xs font-cinzel backdrop-blur-md border border-[#d4af37]/40 flex items-center gap-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" /> Inspect
                  </button>

                  <button
                    onClick={(e) => onTogglePin(art.id, e)}
                    className={`p-2 rounded-full backdrop-blur-md transition-transform duration-200 shadow-lg ${
                      art.isPinned
                        ? 'bg-rose-600 text-white scale-105'
                        : 'bg-black/50 text-white hover:bg-rose-600'
                    }`}
                    title={art.isPinned ? 'Unpin' : 'Pin to Board'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${art.isPinned ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
