import { Artwork, Board, ExhibitionSettings } from '../types';
import { INITIAL_ARTWORKS, INITIAL_BOARDS } from '../data/initialArtworks';

const STORAGE_KEYS = {
  ARTWORKS: 'aanchal_gallery_artworks_v2',
  BOARDS: 'aanchal_gallery_boards_v2',
  EXHIBITION_SETTINGS: 'aanchal_exhibition_settings_v2',
  DARK_MODE: 'aanchal_gallery_dark_mode'
};

export const loadStoredArtworks = (): Artwork[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
    if (!data) return INITIAL_ARTWORKS;
    const parsed = JSON.parse(data) as Artwork[];
    return parsed.length > 0 ? parsed : INITIAL_ARTWORKS;
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
