export type Category = 
  | 'All'
  | 'Digital Painting'
  | 'Sketch'
  | 'Oil Study'
  | 'Watercolor'
  | 'Concept Art'
  | 'Charcoal';

export type FrameStyle = 'gold' | 'wood' | 'ebony' | 'ornate' | 'minimal';

export interface Artwork {
  id: string;
  serialNumber: string; // e.g. "001", "002"... "030"
  filename: string; // e.g. "001.jpg"
  title: string;
  category: Category;
  year: string;
  description: string;
  dimensions: string; // e.g. "3840 x 2160 px"
  imageUrl: string;
  highResUrl?: string;
  tags: string[];
  isPinned: boolean;
  boardId?: string; // Pinterest board assignment
  frameType: FrameStyle;
  likes: number;
  views: number;
  medium: string; // e.g. "Digital Canvas on Photoshop & Procreate"
  aspectRatio: number; // width / height for Pinterest masonry
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isDefault?: boolean;
  createdAt: string;
}

export type ViewMode = 'gallery' | 'pinterest' | 'exhibition3d' | 'catalog';

export interface ExhibitionSettings {
  roomStyle: 'classic' | 'modern' | 'velvet' | 'gilded';
  lighting: 'warm' | 'dramatic' | 'daylight';
  autoTourSpeed: number; // 0 = stopped, 1 = slow, 2 = normal
  musicEnabled: boolean;
}
