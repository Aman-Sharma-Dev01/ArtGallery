import { Artwork, Board, ExhibitionSettings } from '../types';
import { INITIAL_ARTWORKS, INITIAL_BOARDS } from '../data/initialArtworks';

const GALLERY_IMAGE_BASE = '/gallery-images';
const GALLERY_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

const STORAGE_KEYS = {
  ARTWORKS: 'aanchal_gallery_artworks_v2',
  BOARDS: 'aanchal_gallery_boards_v2',
  EXHIBITION_SETTINGS: 'aanchal_exhibition_settings_v2',
  DARK_MODE: 'aanchal_gallery_dark_mode'
};

const mergeArtworksWithDiscoveredGallery = (artworks: Artwork[]): Artwork[] => {
  const merged = [...artworks];

  INITIAL_ARTWORKS.forEach((discoveredArtwork) => {
    const existingIndex = merged.findIndex((artwork) =>
      artwork.serialNumber === discoveredArtwork.serialNumber || artwork.filename === discoveredArtwork.filename
    );

    if (existingIndex === -1) {
      merged.push(discoveredArtwork);
      return;
    }

    const existingArtwork = merged[existingIndex];
    merged[existingIndex] = {
      ...discoveredArtwork,
      ...existingArtwork,
      id: existingArtwork.id || discoveredArtwork.id,
      serialNumber: existingArtwork.serialNumber || discoveredArtwork.serialNumber,
      filename: existingArtwork.filename || discoveredArtwork.filename,
      title: existingArtwork.title || discoveredArtwork.title,
      category: existingArtwork.category || discoveredArtwork.category,
      year: existingArtwork.year || discoveredArtwork.year,
      description: existingArtwork.description || discoveredArtwork.description,
      dimensions: existingArtwork.dimensions || discoveredArtwork.dimensions,
      imageUrl: existingArtwork.imageUrl || discoveredArtwork.imageUrl,
      highResUrl: existingArtwork.highResUrl || discoveredArtwork.highResUrl,
      tags: existingArtwork.tags?.length ? existingArtwork.tags : discoveredArtwork.tags,
      boardId: existingArtwork.boardId || discoveredArtwork.boardId,
      frameType: existingArtwork.frameType || discoveredArtwork.frameType,
      likes: existingArtwork.likes || discoveredArtwork.likes,
      views: existingArtwork.views || discoveredArtwork.views,
      medium: existingArtwork.medium || discoveredArtwork.medium,
      aspectRatio: existingArtwork.aspectRatio || discoveredArtwork.aspectRatio,
      createdAt: existingArtwork.createdAt || discoveredArtwork.createdAt,
      isPinned: existingArtwork.isPinned
    };
  });

  return Array.from(new Map(merged.map((artwork) => [artwork.serialNumber, artwork])).values())
    .sort((a, b) => parseInt(b.serialNumber, 10) - parseInt(a.serialNumber, 10));
};

export const loadStoredArtworks = (): Artwork[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
    if (!data) return mergeArtworksWithDiscoveredGallery([]);
    const parsed = JSON.parse(data) as Artwork[];
    return parsed.length > 0 ? mergeArtworksWithDiscoveredGallery(parsed) : mergeArtworksWithDiscoveredGallery([]);
  } catch (err) {
    console.error('Failed to load artworks from storage', err);
    return INITIAL_ARTWORKS;
  }
};

export const saveArtworksToStorage = (artworks: Artwork[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(artworks));
  } catch (err) {
    console.error('Failed to save artworks to storage', err);
  }
};

export const loadStoredBoards = (): Board[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOARDS);
    if (!data) return INITIAL_BOARDS;
    const parsed = JSON.parse(data) as Board[];
    return parsed.length > 0 ? parsed : INITIAL_BOARDS;
  } catch (err) {
    console.error('Failed to load boards from storage', err);
    return INITIAL_BOARDS;
  }
};

export const saveBoardsToStorage = (boards: Board[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  } catch (err) {
    console.error('Failed to save boards to storage', err);
  }
};

export const loadExhibitionSettings = (): ExhibitionSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXHIBITION_SETTINGS);
    if (!data) return { roomStyle: 'classic', lighting: 'warm', autoTourSpeed: 1, musicEnabled: false };
    return JSON.parse(data);
  } catch {
    return { roomStyle: 'classic', lighting: 'warm', autoTourSpeed: 1, musicEnabled: false };
  }
};

export const saveExhibitionSettings = (settings: ExhibitionSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXHIBITION_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save exhibition settings', err);
  }
};

export const getNextSerialNumber = (artworks: Artwork[]): string => {
  let maxNum = 0;
  artworks.forEach(art => {
    const cleaned = art.serialNumber.replace(/\D/g, '');
    const val = parseInt(cleaned, 10);
    if (!isNaN(val) && val > maxNum) {
      maxNum = val;
    }
  });
  return (maxNum + 1).toString().padStart(3, '0');
};

const getSerialNumberValue = (serialNumber: string): number => {
  const cleaned = serialNumber.replace(/\D/g, '');
  const value = parseInt(cleaned, 10);
  return Number.isNaN(value) ? 0 : value;
};

const buildDiscoveredArtwork = (serialNumber: string, filename: string, imageUrl: string, index: number): Artwork => {
  return {
    id: `art-${serialNumber}`,
    serialNumber,
    filename,
    title: `Artwork #${serialNumber}`,
    category: 'Digital Painting',
    year: new Date().getFullYear().toString(),
    description: `Auto-discovered from public gallery as serial #${filename}.`,
    dimensions: '3840 x 2160 px',
    imageUrl,
    highResUrl: imageUrl,
    tags: ['AanchalArt', 'Digital Painting', `Catalog-${serialNumber}`, 'AutoImported'],
    isPinned: false,
    boardId: 'board-masterpieces',
    frameType: 'gold',
    likes: 0,
    views: 0,
    medium: 'Digital Artwork',
    aspectRatio: 1,
    createdAt: new Date(Date.now() - index * 86400000).toISOString().split('T')[0]
  };
};

const canLoadImage = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const image = new Image();
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
    };

    const timerId = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, 2500);

    image.onload = () => {
      window.clearTimeout(timerId);
      cleanup();
      resolve(true);
    };

    image.onerror = () => {
      window.clearTimeout(timerId);
      cleanup();
      resolve(false);
    };

    image.src = `${imageUrl}?v=${Date.now()}`;
  });
};

const probePublicGalleryImage = async (serialNumber: string): Promise<{ filename: string; imageUrl: string } | null> => {
  for (const extension of GALLERY_IMAGE_EXTENSIONS) {
    const filename = `${serialNumber}.${extension}`;
    const imageUrl = `${GALLERY_IMAGE_BASE}/${filename}`;

    const exists = await canLoadImage(imageUrl);
    if (exists) {
      return { filename, imageUrl };
    }
  }

  return null;
};

export const syncArtworksWithPublicGallery = async (artworks: Artwork[]): Promise<Artwork[]> => {
  const artworkChecks = await Promise.all(
    artworks.map(async (artwork) => {
      const isAutoImported = artwork.tags.includes('AutoImported');
      if (!isAutoImported) {
        return artwork;
      }

      const exists = await canLoadImage(artwork.imageUrl);
      return exists ? artwork : null;
    })
  );

  const cleanedArtworks = artworkChecks.filter((artwork): artwork is Artwork => Boolean(artwork));

  let maxSerialNumber = 0;
  cleanedArtworks.forEach((artwork) => {
    const value = getSerialNumberValue(artwork.serialNumber);
    if (value > maxSerialNumber) {
      maxSerialNumber = value;
    }
  });

  const discovered: Artwork[] = [];
  let missCount = 0;

  for (let candidate = maxSerialNumber + 1; candidate <= maxSerialNumber + 100; candidate += 1) {
    if (missCount >= 5) break;

    const serialNumber = candidate.toString().padStart(3, '0');
    const result = await probePublicGalleryImage(serialNumber);

    if (!result) {
      missCount += 1;
      continue;
    }

    missCount = 0;
    discovered.push(buildDiscoveredArtwork(serialNumber, result.filename, result.imageUrl, cleanedArtworks.length + discovered.length));
  }

  if (discovered.length === 0) {
    return cleanedArtworks;
  }

  return [...cleanedArtworks, ...discovered].sort((a, b) => getSerialNumberValue(b.serialNumber) - getSerialNumberValue(a.serialNumber));
};
