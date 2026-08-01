import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Pin, 
  Download, 
  Share2, 
  Edit3, 
  Eye, 
  Heart, 
  Calendar, 
  Tag, 
  Layers, 
  Maximize2, 
  Sparkles, 
  Save, 
  FileText,
  Check
} from 'lucide-react';
import { Artwork, Category, FrameStyle } from '../types';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onUpdateArtwork: (updated: Artwork) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  artwork,
  onClose,
  onTogglePin,
  onUpdateArtwork
}) => {
  if (!artwork) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(artwork.title);
  const [editedCategory, setEditedCategory] = useState<Category>(artwork.category);
  const [editedSerial, setEditedSerial] = useState(artwork.serialNumber);
  const [editedDesc, setEditedDesc] = useState(artwork.description);
  const [editedMedium, setEditedMedium] = useState(artwork.medium);
  const [editedFrame, setEditedFrame] = useState<FrameStyle>(artwork.frameType);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleSave = () => {
    onUpdateArtwork({
      ...artwork,
      title: editedTitle,
      category: editedCategory,
      serialNumber: editedSerial,
      filename: `${editedSerial}.jpg`,
      description: editedDesc,
      medium: editedMedium,
      frameType: editedFrame
    });
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoriesList: Category[] = [
    'Digital Painting',
    'Sketch',
    'Oil Study',
    'Watercolor',
    'Concept Art',
    'Charcoal'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#f7f2e7] dark:bg-[#1a1612] w-full max-w-5xl rounded-3xl border border-[#d4af37] shadow-2xl overflow-hidden my-auto"
        >
          {/* Top Header Seal Bar */}
          <div className="px-6 py-3 bg-[#eae1ce] dark:bg-[#231d17] border-b border-[#d8c8b0] dark:border-[#382b1f] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#d4af37]" />
              <span className="font-cinzel text-xs font-bold text-[#3d2b1d] dark:text-[#f3e9d8] uppercase tracking-widest">
                ARCHIVAL EXHIBIT • CATALOG NO. {artwork.serialNumber}.JPG
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onTogglePin(artwork.id, e)}
                className={`p-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 transition-all ${
                  artwork.isPinned
                    ? 'bg-rose-600 text-white'
                    : 'bg-[#d8c8b0] dark:bg-[#382b1f] text-[#3d2b1d] dark:text-[#f3e9d8] hover:bg-rose-600 hover:text-white'
                }`}
              >
                <Pin className={`w-4 h-4 ${artwork.isPinned ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{artwork.isPinned ? 'Pinned' : 'Pin to Board'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#d8c8b0] dark:bg-[#382b1f] text-[#3d2b1d] dark:text-[#f3e9d8] hover:bg-red-600 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-h-[80vh] overflow-y-auto">
            {/* Left: Framed Image Showcase */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#120e0a] p-4 rounded-2xl border border-[#3d2b1d] relative">
              {/* Zoom Controls */}
              <div className="absolute top-6 right-6 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/20 text-white text-xs">
                <button 
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                  className="px-2 py-1 hover:bg-white/20 rounded"
                >
                  -
                </button>
                <span className="px-2 font-mono text-[11px]">{Math.round(zoomLevel * 100)}%</span>
                <button 
                  onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
                  className="px-2 py-1 hover:bg-white/20 rounded"
                >
                  +
                </button>
              </div>

              {/* Framed Canvas */}
              <div className="vintage-gold-frame rounded-lg overflow-hidden shadow-2xl max-h-[550px] transition-transform duration-300">
                <div className="vintage-matting">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-[460px] w-auto object-contain transition-transform duration-200 cursor-zoom-in"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between w-full text-xs text-[#c5a059] font-cinzel">
                <span>Medium: {artwork.medium}</span>
                <span>Dim: {artwork.dimensions}</span>
              </div>
            </div>

            {/* Right: Museum Plaque & Curator Details */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              {isEditing ? (
                /* Edit Mode Form */
                <div className="space-y-4 bg-[#efe7d6] dark:bg-[#231c15] p-5 rounded-2xl border border-[#d4af37]">
                  <h4 className="font-cinzel text-sm font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">
                    Edit Artwork Catalogue Record
                  </h4>

                  <div>
                    <label className="block text-xs font-cinzel text-[#705844] dark:text-[#a89582] mb-1">
                      Artwork Title
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#f7f2e7] dark:bg-[#1a1612] border border-[#d8c8b0] dark:border-[#382b1f] rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-cinzel text-[#705844] dark:text-[#a89582] mb-1">
                        Serial Number (.jpg)
                      </label>
                      <input
                        type="text"
                        value={editedSerial}
                        onChange={(e) => setEditedSerial(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#f7f2e7] dark:bg-[#1a1612] border border-[#d8c8b0] dark:border-[#382b1f] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel text-[#705844] dark:text-[#a89582] mb-1">
                        Category
                      </label>
                      <select
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value as Category)}
                        className="w-full px-3 py-1.5 bg-[#f7f2e7] dark:bg-[#1a1612] border border-[#d8c8b0] dark:border-[#382b1f] rounded-lg text-xs"
                      >
                        {categoriesList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel text-[#705844] dark:text-[#a89582] mb-1">
                      Curator Description
                    </label>
                    <textarea
                      rows={3}
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#f7f2e7] dark:bg-[#1a1612] border border-[#d8c8b0] dark:border-[#382b1f] rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs font-cinzel text-[#705844]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 bg-[#3d2b1d] dark:bg-[#d4af37] text-[#f5ebd8] dark:text-[#120e0a] text-xs font-cinzel font-bold rounded-lg flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode Museum Plaque */
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-sans text-[#8c6d4f] dark:text-[#c5a059] uppercase tracking-wider font-semibold">
                      <span>{artwork.category}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-[#8b6222] dark:text-[#d4af37] hover:underline"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Record
                      </button>
                    </div>

                    <h2 className="font-cormorant font-bold text-3xl text-[#2c1e14] dark:text-[#f3e8d7] leading-tight mt-1">
                      {artwork.title}
                    </h2>

                    <p className="font-cinzel text-xs text-[#8c745f] dark:text-[#a08f7d] mt-1">
                      Archive File: <code className="bg-[#eae1ce] dark:bg-[#28211a] px-1.5 py-0.5 rounded font-mono text-amber-700 dark:text-amber-400">{artwork.filename}</code>
                    </p>
                  </div>

                  {/* Brass Plaque Box */}
                  <div className="p-4 bg-[#efe7d6] dark:bg-[#231b14] rounded-2xl border-l-4 border-[#d4af37] shadow-inner space-y-2">
                    <h4 className="font-cinzel text-xs font-bold text-[#3d2b1d] dark:text-[#f3e9d8] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#d4af37]" /> CURATOR’S NOTES
                    </h4>
                    <p className="font-cormorant italic text-sm text-[#523e2d] dark:text-[#c5b5a2] leading-relaxed">
                      "{artwork.description}"
                    </p>
                  </div>

                  {/* Metadata Specs */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#f0e8d8] dark:bg-[#221b15] rounded-xl">
                      <span className="block font-cinzel text-[10px] text-[#8c6d4f] dark:text-[#998573]">DATE CREATED</span>
                      <span className="font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">{artwork.year}</span>
                    </div>

                    <div className="p-3 bg-[#f0e8d8] dark:bg-[#221b15] rounded-xl">
                      <span className="block font-cinzel text-[10px] text-[#8c6d4f] dark:text-[#998573]">CANVAS RESOLUTION</span>
                      <span className="font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">{artwork.dimensions}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <span className="block font-cinzel text-[10px] text-[#8c6d4f] dark:text-[#998573] mb-1">ARCHIVAL TAGS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {artwork.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#e5dbc7] dark:bg-[#282018] text-[#5c4734] dark:text-[#c5a059] text-[11px] font-sans">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e2d6c3] dark:border-[#2a221a] flex items-center justify-between gap-3">
                <a
                  href={artwork.imageUrl}
                  download={artwork.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#3d2b1d] dark:bg-[#d4af37] text-[#f5ebd8] dark:text-[#120e0a] font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all"
                >
                  <Download className="w-4 h-4" /> Download High-Res
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
