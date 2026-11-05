/**
 * Unified text formatting utilities for Agrimart
 * Ensures consistent typography, casing, and readability across all components and pages.
 */

const lowerWords = new Set([
  'in', 'on', 'with', 'out', 'and', 'or', 'for', 'of', 'to', 'a', 'an', 'the', 'at', 'by'
]);

const keepUpper = new Set([
  'RIPL', 'AM', 'KZ', 'OM', 'BC', 'RT', 'MT', 'EA', 'HT', 'CS', 'WP', 'SP', 'BBP',
  '2S', '4S', '2T', '4T', 'NEO', 'PRO', 'MS+', 'R&F', 'BBP-PRO', 'EA-NEO', 'CC', 'HP', 'KW',
  'RPM', 'ULV', 'LED', 'MB', '4-IN-1', '3-IN-1', '2-IN-1', 'FT', 'MM', 'KG', 'AC', 'DC',
  'MPTC', 'BCH', 'BBP', 'EA', 'BS', 'IS', 'AMH', 'HD', 'XP', 'GX', 'GP', 'TR', 'BV', 'MBD',
  'BPH', 'BP', 'WC', 'SPARTA', 'TR91E-OM', 'RTP', 'CCMG', 'WT', 'AL',
  'LTRS', 'AH', 'V', 'L', 'PP', 'W', 'MAX', 'SS', 'HTP', 'GT', 'GS', 'GSH'
]);

/**
 * Formats a product name into clean, consistent Title Case while preserving
 * technical model codes and abbreviations (e.g. KZ-6300, 2S, 4-in-1, RIPL).
 */
export function formatProductTitle(name: string): string {
  if (!name) return '';
  let cleaned = name
    .replace(/-\s+/g, ' ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\bInter\s+Cultivator\b/gi, 'Intercultivator')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(/\s+/);
  
  return tokens.map((token, idx) => {
    // If token has hyphens/slashes
    if (token.includes('-') || token.includes('/')) {
      return token
        .split(/([-/])/)
        .map(part => {
          if (part === '-' || part === '/') return part;
          const upper = part.toUpperCase();
          if (keepUpper.has(upper) || (/^[A-Z0-9+]+$/.test(part) && /\d/.test(part))) {
            return upper;
          }
          if (idx > 0 && lowerWords.has(part.toLowerCase())) {
            return part.toLowerCase();
          }
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join('');
    }

    const upper = token.toUpperCase();
    if (keepUpper.has(upper) || (/^[A-Z0-9+]+$/.test(token) && /\d/.test(token))) {
      return upper;
    }
    if (idx > 0 && lowerWords.has(token.toLowerCase())) {
      return token.toLowerCase();
    }
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  }).join(' ');
}

/**
 * Returns an authentic category-specific default fallback image for equipment
 * so cards never display a blank space or broken placeholder.
 */
export function getDefaultCategoryImage(category?: string): string {
  if (!category) return '/assets/products/ripl038521/img_1.jpg';
  const c = category.toUpperCase();
  if (c.includes('CHAIN SAW') || c.includes('CHAINSAW')) {
    return '/assets/products/ripl029552/img_1.jpg'; // Oleo-Mac GSH 56 Chainsaw
  }
  if (c.includes('TILLER') || c.includes('INTERCULTIVATOR') || c.includes('WEEDER')) {
    return '/assets/products/ripl038521/img_1.jpg'; // Agrimate Intercultivator
  }
  if (c.includes('BRUSH CUTTER') || c.includes('WEED CUTTER') || c.includes('HARVESTER')) {
    return '/assets/products/ripl037692/img_1.jpg'; // Kasei Plus Brush Cutter
  }
  if (c.includes('SPRAYER') || c.includes('MISTBLOWER') || c.includes('FOGGER')) {
    return '/assets/products/ripl036461/img_1.jpg'; // Knapsack Power Sprayer
  }
  if (c.includes('TRANSPORTER') || c.includes('TROLLEY')) {
    return '/assets/products/ripl036445/img_1.jpg'; // Agrimate Wheel Trolley
  }
  if (c.includes('CHAFF') || c.includes('SHREDDER') || c.includes('CHIPPER')) {
    return '/assets/products/ripl036956/img_1.jpg'; // Agrimate Chaff Cutter
  }
  if (c.includes('LAWN MOWER') || c.includes('MOWER')) {
    return '/assets/products/ripl026782/img_1.jpg'; // Lawn Mower
  }
  if (c.includes('EARTH AUGER') || c.includes('AUGER')) {
    return '/assets/products/ripl036573/img_1.jpg'; // Earth Auger
  }
  if (c.includes('PUMP') || c.includes('WASHER')) {
    return '/assets/products/ripl028594/img_1.jpg'; // Water Pump
  }
  if (c.includes('HEDGE')) {
    return '/assets/products/ripl022416/img_1.jpg'; // Hedge Trimmer
  }
  return '/assets/products/ripl038521/img_1.jpg';
}

/**
 * Formats a category name into clean Title Case (e.g. 'BRUSH CUTTER - WEED CUTTER' -> 'Brush Cutter - Weed Cutter')
 */
export function formatCategoryName(name: string): string {
  if (!name) return '';

  const overrides: Record<string, string> = {
    'BLOWER - MISTBLOWER': 'Blower - Mistblower',
    'BRUSH CUTTER - WEED CUTTER': 'Brush Cutter - Weed Cutter',
    'CHAFF CUTTER / SHREDDER': 'Chaff Cutter / Shredder',
    'CHAIN SAW': 'Chain Saw',
    'EARTH AUGER': 'Earth Auger',
    'ENGINE': 'Engine',
    'FOGGER ULV & THERMAL': 'Fogger / ULV & Thermal',
    'GARDEN TOOLS & SPRAYERS': 'Garden Tools & Sprayers',
    'HARVESTER': 'Harvester',
    'HEDGETRIMMER': 'Hedgetrimmer',
    'INTERCULTIVATOR/POWER WEEDER': 'Intercultivator / Power Weeder',
    'IRRIGATION': 'Irrigation',
    'LAWN MOWER': 'Lawn Mower',
    'LUBRICANTS': 'Lubricants',
    'MANUAL SEEDER': 'Manual Seeder',
    'MILKING  MACHINE': 'Milking Machine',
    'POWER CUTTER': 'Power Cutter',
    'PRUNER': 'Pruner',
    'PRESSURE WASHER': 'Pressure Washer',
    'PUMPSET': 'Pumpset',
    'REAPER / HARVESTER': 'Reaper / Harvester',
    'ROTAVATOR': 'Rotavator',
    'SPRAYER': 'Sprayer',
    'STUBBLE MOWER': 'Stubble Mower',
    'THRESHER': 'Thresher',
    'TRANSPORTER': 'Transporter',
    'WOOD CHIPPER': 'Wood Chipper',
    'MB PLOUGH': 'MB Plough'
  };

  if (overrides[name.toUpperCase()]) {
    return overrides[name.toUpperCase()];
  }

  return name
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
