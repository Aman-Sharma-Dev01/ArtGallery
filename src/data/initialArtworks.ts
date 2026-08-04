import { Artwork, Board } from '../types';

const GALLERY_IMAGE_BASE = '/gallery-images';

type DiscoveredGalleryImage = {
  serialNumber: string;
  filename: string;
  imageUrl: string;
};

const getDiscoveredGalleryImages = (): DiscoveredGalleryImage[] => {
  const galleryImageModules = import.meta.glob('/gallery-images/*.{jpg,jpeg,png,webp,avif}', {
    eager: true,
    import: 'default'
  });

  return Object.entries(galleryImageModules)
    .map(([path, imageUrl]) => {
      if (typeof imageUrl !== 'string') return null;

      const fileName = path.split('/').pop() ?? '';
      const match = fileName.match(/^(\d+)\.(jpg|jpeg|png|webp|avif)$/i);
      if (!match) return null;

      return {
        serialNumber: match[1].padStart(3, '0'),
        filename: fileName,
        imageUrl: imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
      };
    })
    .filter((image): image is DiscoveredGalleryImage => Boolean(image))
    .sort((a, b) => parseInt(a.serialNumber, 10) - parseInt(b.serialNumber, 10));
};

const createArtworkFromIndex = (index: number, serialNumber: string, filename: string, imageUrl: string): Artwork => {
  const titles = [
    'The Golden Hour Reverie',
    'Whispers of the Antique Conservatory',
    'Midnight Charcoal Study No. IV',
    'Portrait of a Venetian Muse',
    'Gilded Renaissance Impression',
    'The Botanist’s Lost Sketchbook',
    'Solitude in Sapphire Oil',
    'Symphony in Sepia Tone',
    'Anatomical Elegance in Ink',
    'The Celestial Astrolabe',
    'Ethereal Misty Pines',
    'Gothic Chiaroscuro Light',
    'Fading Sun Over Autumn Ridge',
    'The Emerald Crowned Sorceress',
    'Draped Silk & Shadow',
    'Sketches from the Florentine Court',
    'The Astronomer’s Nocturne',
    'Gilded Lotus on Aged Parchment',
    'The Alchemist’s Laboratory',
    'Velvet Twilight Landscape',
    'Rough Graphite Figure Study',
    'The Baroque Violinist',
    'Echoes of the Renaissance',
    'Illuminated Botanical Manuscript',
    'The Seraphic Maiden',
    'Stormy Shore at Cape Hope',
    'Ornate Gold & Damask Composition',
    'The Quiet Library Corner',
    'Solace of the Ancient Scholar',
    'Grand Gallery Finale'
  ];

  const categories: Artwork['category'][] = [
    'Digital Painting',
    'Oil Study',
    'Charcoal',
    'Digital Painting',
    'Oil Study',
    'Sketch',
    'Digital Painting',
    'Watercolor',
    'Sketch',
    'Concept Art',
    'Watercolor',
    'Oil Study',
    'Digital Painting',
    'Concept Art',
    'Charcoal',
    'Sketch',
    'Oil Study',
    'Digital Painting',
    'Concept Art',
    'Oil Study',
    'Sketch',
    'Digital Painting',
    'Oil Study',
    'Watercolor',
    'Concept Art',
    'Oil Study',
    'Digital Painting',
    'Sketch',
    'Charcoal',
    'Digital Painting'
  ];

  const frameStyles: Artwork['frameType'][] = ['gold', 'wood', 'ebony', 'ornate', 'gold'];

  const primaryColors = ['#8b4513', '#2f4f4f', '#4a0e17', '#1c2833', '#5c3a21', '#1e3d59', '#3b1c32', '#2c3539'];
  const secondaryColors = ['#d4af37', '#c5a059', '#a37f37', '#e6c687', '#b8860b', '#7a5a29'];

  const category = categories[index % categories.length];
  const title = titles[index % titles.length];
  const primaryColor = primaryColors[index % primaryColors.length];
  const secondaryColor = secondaryColors[index % secondaryColors.length];

  let boardId = 'board-masterpieces';
  if (category === 'Sketch' || category === 'Charcoal') boardId = 'board-sketches';
  else if (title.includes('Portrait') || title.includes('Muse') || title.includes('Maiden') || title.includes('Sorceress')) boardId = 'board-portraits';
  else if (category === 'Watercolor' || title.includes('Landscape') || title.includes('Shore') || title.includes('Pines')) boardId = 'board-landscapes';

  const aspectRatios = [0.8, 1.25, 0.75, 1.0, 1.33, 0.7];
  const aspectRatio = aspectRatios[index % aspectRatios.length];

  return {
    id: `art-${serialNumber}`,
    serialNumber,
    filename,
    title,
    category,
    year: (2024 + (index % 3)).toString(),
    description: `Original ${category.toLowerCase()} crafted by Aanchal, recorded as catalog index #${serialNumber}. Emphasizes classic lighting, soft tonal transitions, and rich textural depth.`,
    dimensions: `${3200 + (index * 120)} x ${2400 + (index * 90)} px`,
    imageUrl,
    highResUrl: imageUrl,
    tags: ['AanchalArt', category, `Catalog-${serialNumber}`, index % 2 === 0 ? 'Vintage' : 'Studio', 'DigitalFineArt'],
    isPinned: index < 8 || index === 11 || index === 14 || index === 21,
    boardId,
    frameType: frameStyles[index % frameStyles.length],
    likes: 42 + (index * 13) % 180,
    views: 120 + (index * 47) % 650,
    medium: category === 'Sketch' ? 'Graphite & Charcoal on Textured Digital Vellum' : 'Digital Oil & Glazing on High-Res Canvas',
    aspectRatio,
    createdAt: new Date(Date.now() - index * 86400000 * 3).toISOString().split('T')[0]
  };
};

// Helper to generate a procedural SVG canvas artwork for fallback or instant display
export const createArtCanvasFallback = (serial: string, title: string, category: string, primaryColor: string, secondaryColor: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <defs>
      <linearGradient id="bg-${serial}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="50%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="#120e0b"/>
      </linearGradient>
      <radialGradient id="glow-${serial}" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#fff8e7" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.7"/>
      </radialGradient>
      <filter id="noise-${serial}">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
        <feColorMatrix type="saturate" values="0.1"/>
        <feBlend in="SourceGraphic" in2="noise" mode="multiply" opacity="0.6"/>
      </filter>
    </defs>
    <rect width="800" height="1000" fill="url(#bg-${serial})"/>
    <circle cx="400" cy="420" r="280" fill="url(#glow-${serial})"/>
    <!-- Abstract Artistic Strokes -->
    <path d="M 150,300 Q 400,100 650,300 T 400,800 Z" fill="none" stroke="#d4af37" stroke-width="3" opacity="0.4"/>
    <path d="M 200,400 C 300,200 500,600 600,350 S 300,700 200,400 Z" fill="${primaryColor}" opacity="0.25"/>
    <circle cx="400" cy="380" r="160" fill="none" stroke="#f0e6d2" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.5"/>
    
    <!-- Vintage Vignette Overlay -->
    <rect width="800" height="1000" fill="none" stroke="#3d2c1e" stroke-width="20" opacity="0.8"/>
    <!-- Serial Stamp Seal -->
    <g transform="translate(620, 840)">
      <rect width="130" height="110" rx="6" fill="#1f1812" stroke="#c5a059" stroke-width="1.5"/>
      <text x="65" y="35" font-family="serif" font-size="12" fill="#c5a059" text-anchor="middle" letter-spacing="2">AANCHAL ART</text>
      <text x="65" y="65" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f5f0eb" text-anchor="middle">${serial}.JPG</text>
      <text x="65" y="90" font-family="serif" font-size="10" fill="#a38f78" text-anchor="middle">ARCHIVAL NO.</text>
    </g>
    <!-- Title and Category Stamp -->
    <text x="50" y="890" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#fdfbf7" opacity="0.95">${title}</text>
    <text x="50" y="930" font-family="sans-serif" font-size="16" fill="#d4af37" letter-spacing="3" opacity="0.9">${category.toUpperCase()} • ${serial}.JPG</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_BOARDS: Board[] = [
  {
    id: 'board-masterpieces',
    name: 'Featured Masterpieces',
    description: 'Aanchal’s flagship digital oil paintings & museum collection.',
    isDefault: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'board-sketches',
    name: 'Raw Sketches & Charcoal',
    description: 'Quick concept studies, anatomical drafts, and expressive line art.',
    isDefault: false,
    createdAt: '2026-02-01'
  },
  {
    id: 'board-portraits',
    name: 'Vintage Portraits',
    description: 'Character studies infused with Renaissance lighting and gold leaf touches.',
    isDefault: false,
    createdAt: '2026-03-10'
  },
  {
    id: 'board-landscapes',
    name: 'Ethereal Landscapes',
    description: 'Atmospheric digital watercolors and misty wilderness impressions.',
    isDefault: false,
    createdAt: '2026-04-12'
  }
];

// Pre-generated list of discovered gallery images in public/gallery-images
const discoveredGalleryImages = getDiscoveredGalleryImages();

export const INITIAL_ARTWORKS: Artwork[] = discoveredGalleryImages.length > 0
  ? discoveredGalleryImages.map((image, index) => createArtworkFromIndex(index, image.serialNumber, image.filename, image.imageUrl))
  : Array.from({ length: 56 }, (_, index) => {
      const serialNumber = (index + 1).toString().padStart(3, '0');
      const filename = `${serialNumber}.jpg`;
      const imageUrl = `${GALLERY_IMAGE_BASE}/${filename}`;
      return createArtworkFromIndex(index, serialNumber, filename, imageUrl);
    });
