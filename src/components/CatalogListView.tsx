import React from 'react';
import { Tag, Eye, Pin, Edit, Layers, FileImage, Sparkles } from 'lucide-react';
import { Artwork } from '../types';

interface CatalogListViewProps {
  artworks: Artwork[];
  onInspect: (artwork: Artwork) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
}

export const CatalogListView: React.FC<CatalogListViewProps> = ({
  artworks,
  onInspect,
  onTogglePin
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-6 bg-[#f5f0e3] dark:bg-[#1a1612] p-6 rounded-2xl border border-[#dcd0bc] dark:border-[#2e261e] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-cinzel font-bold uppercase tracking-widest mb-1">
            <FileImage className="w-4 h-4" />
            <span>SERIAL NUMBER ARCHIVAL INDEX</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#3d2b1d] dark:text-[#f3e9d8]">
            Archival Catalog Index (001.jpg - {artworks.length.toString().padStart(3, '0')}.jpg)
          </h2>
          <p className="font-cormorant italic text-sm text-[#705844] dark:text-[#a89582] mt-1">
            Complete sequential list of all archived digital paintings, sketches, and studies.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#eae1ce] dark:bg-[#231d17] px-4 py-2 rounded-xl border border-[#d8c8b0] dark:border-[#382b1f] text-xs font-cinzel font-bold text-[#3d2b1d] dark:text-[#d4af37]">
          <Sparkles className="w-4 h-4" />
          <span>Total Records: {artworks.length} Files</span>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-[#f5f0e3] dark:bg-[#1a1612] rounded-2xl border border-[#dcd0bc] dark:border-[#2e261e] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eae1ce] dark:bg-[#231d17] border-b border-[#d8c8b0] dark:border-[#382b1f] text-[11px] font-cinzel font-bold text-[#5c4632] dark:text-[#d4af37] uppercase tracking-wider">
                <th className="py-3.5 px-4">Serial File</th>
                <th className="py-3.5 px-4">Preview</th>
                <th className="py-3.5 px-4">Title & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Dimensions</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d6c3] dark:divide-[#28211a] text-xs">
              {artworks.map((art) => (
                <tr 
                  key={art.id}
                  className="hover:bg-[#efe7d6] dark:hover:bg-[#221c16] transition-colors duration-150 group"
                >
                  {/* Serial Number */}
                  <td className="py-3 px-4 font-mono font-bold text-[#8c6d4f] dark:text-[#d4af37]">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{art.filename}</span>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <div 
                      onClick={() => onInspect(art)}
                      className="w-12 h-12 rounded-lg bg-[#14110e] p-1 border border-[#d4af37]/40 overflow-hidden cursor-pointer group-hover:scale-105 transition-transform"
                    >
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4">
                    <h4 
                      onClick={() => onInspect(art)}
                      className="font-cormorant font-bold text-base text-[#2c1e14] dark:text-[#f3e8d7] cursor-pointer hover:text-[#d4af37]"
                    >
                      {art.title}
                    </h4>
                    <p className="font-cormorant italic text-xs text-[#705844] dark:text-[#a89582] line-clamp-1">
                      {art.medium}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#e5dbc7] dark:bg-[#282018] text-[#5c4734] dark:text-[#c5a059] font-sans text-[10px] font-bold uppercase">
                      {art.category}
                    </span>
                  </td>

                  {/* Dimensions */}
                  <td className="py-3 px-4 font-mono text-[#705844] dark:text-[#a89582]">
                    {art.dimensions}
                  </td>

                  {/* Year */}
                  <td className="py-3 px-4 font-mono text-[#705844] dark:text-[#a89582]">
                    {art.year}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => onTogglePin(art.id, e)}
                        className={`p-2 rounded-lg text-xs transition-colors ${
                          art.isPinned
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#eae1ce] dark:bg-[#282018] text-[#705844] dark:text-[#a89582] hover:bg-rose-600 hover:text-white'
                        }`}
                        title={art.isPinned ? 'Unpin' : 'Pin to Board'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={() => onInspect(art)}
                        className="p-2 rounded-lg bg-[#3d2b1d] dark:bg-[#d4af37] text-[#f5ebd8] dark:text-[#120e0a] text-xs font-cinzel font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
