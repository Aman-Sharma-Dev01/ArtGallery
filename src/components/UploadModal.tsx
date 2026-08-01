import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Check, Tag } from 'lucide-react';
import { Artwork, Category, FrameStyle, Board } from '../types';
import { getNextSerialNumber } from '../utils/storage';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingArtworks: Artwork[];
  boards: Board[];
  onAddArtwork: (newArtwork: Artwork) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  existingArtworks,
  boards,
  onAddArtwork
}) => {
  if (!isOpen) return null;

  const defaultSerial = getNextSerialNumber(existingArtworks);
  const [serialNum, setSerialNum] = useState(defaultSerial);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Digital Painting');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState('Digital Canvas on Photoshop & Procreate');
  const [dimensions, setDimensions] = useState('3840 x 2160 px');
  const [frameType, setFrameType] = useState<FrameStyle>('gold');
  const [boardId, setBoardId] = useState<string>(boards[0]?.id || 'board-masterpieces');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const categoriesList: Category[] = [
    'Digital Painting',
    'Sketch',
    'Oil Study',
    'Watercolor',
    'Concept Art',
    'Charcoal'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Auto fill title from filename if empty
      if (!title) {
        const cleanedName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanedName);
      }
      
      // Convert file to Base64/DataURL for immediate high-res local viewing
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFilePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSerial = serialNum.padStart(3, '0');
    const finalFilename = `${finalSerial}.jpg`;
    const finalImage = imageUrl || filePreview || `https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85`;

    const newArt: Artwork = {
      id: `art-${finalSerial}-${Date.now()}`,
      serialNumber: finalSerial,
      filename: finalFilename,
      title: title || `Artwork #${finalSerial}`,
      category,
      year: new Date().getFullYear().toString(),
      description: description || `Original ${category.toLowerCase()} cataloged under index #${finalFilename}.`,
      dimensions: dimensions || '3840 x 2160 px',
      imageUrl: finalImage,
      highResUrl: finalImage,
      tags: ['AanchalArt', category, `Catalog-${finalSerial}`],
      isPinned: true,
      boardId,
      frameType,
      likes: 12,
      views: 34,
      medium,
      aspectRatio: 1.0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddArtwork(newArt);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#f7f2e7] dark:bg-[#1a1612] w-full max-w-2xl rounded-3xl border border-[#d4af37] shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#eae1ce] dark:bg-[#231d17] border-b border-[#d8c8b0] dark:border-[#382b1f] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-cinzel font-bold text-lg text-[#3d2b1d] dark:text-[#f3e9d8]">
                Archive New Serial Image
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#705844] dark:text-[#a89582] hover:bg-[#d8c8b0] dark:hover:bg-[#382b1f]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Serial Number & File Upload Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                  Serial Number Index
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#8c6d4f]">CATALOG NO.</span>
                  <input
                    type="text"
                    required
                    value={serialNum}
                    onChange={(e) => setSerialNum(e.target.value)}
                    placeholder="031"
                    className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs font-bold font-mono text-[#3d2b1d] dark:text-[#f3e9d8]"
                  />
                  <span className="text-xs font-mono text-[#8c6d4f]">.JPG</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8]"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                Upload High-Resolution Artwork Image
              </label>

              <div className="relative border-2 border-dashed border-[#c5a059] dark:border-[#4d3a28] rounded-2xl p-6 bg-[#efe7d6]/50 dark:bg-[#211a14]/50 text-center hover:bg-[#efe7d6] dark:hover:bg-[#211a14] transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-40 rounded-lg border border-[#d4af37] shadow-md mb-2"
                    />
                    <span className="text-xs font-cinzel text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Image Ready ({serialNum}.jpg)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-[#c5a059] mb-2 animate-bounce" />
                    <p className="text-xs font-cinzel font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">
                      Click or Drag & Drop Artwork File Here
                    </p>
                    <p className="text-[11px] font-cormorant italic text-[#705844] dark:text-[#a89582] mt-0.5">
                      Supports high-resolution PNG, JPG, WEBP formats.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Image URL Fallback */}
            <div>
              <label className="block text-xs font-cinzel text-[#705844] dark:text-[#a89582] mb-1">
                Or Paste Image Web URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8]"
              />
            </div>

            {/* Title & Medium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                  Artwork Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venetian Mask in Sepia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                  Frame Aesthetic
                </label>
                <select
                  value={frameType}
                  onChange={(e) => setFrameType(e.target.value as FrameStyle)}
                  className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8]"
                >
                  <option value="gold">Gilded Gold Frame</option>
                  <option value="wood">Carved Mahogany Wood</option>
                  <option value="ebony">Ebony Black Frame</option>
                  <option value="ornate">Rococo Ornate Frame</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] mb-1">
                Curator Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief notes on technique, brushwork, or inspiration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#efe7d6] dark:bg-[#231c15] border border-[#d8c8b0] dark:border-[#382b1f] rounded-xl text-xs text-[#3d2b1d] dark:text-[#f3e9d8]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d8c8b0] dark:border-[#382b1f]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-cinzel font-bold text-[#705844] dark:text-[#a89582] hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b38927] text-[#120e0a] font-cinzel font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-all"
              >
                Commit to Archival Gallery
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
