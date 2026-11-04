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
  'BPH', 'BP', 'WC', 'SPARTA', 'TR91E-OM'
]);

/**
 * Formats a product name into clean, consistent Title Case while preserving
 * technical model codes and abbreviations (e.g. KZ-6300, 2S, 4-in-1, RIPL).
 */
export function formatProductTitle(name: string): string {
  if (!name) return '';
  const tokens = name.trim().split(/\s+/);
  
  return tokens.map((token, idx) => {
    // If token has hyphens/slashes
    if (token.includes('-') || token.includes('/')) {
      return token
        .split(/([-/])/)
        .map(part => {
          if (part === '-' || part === '/') return part;
          const upper = part.toUpperCase();
          if (keepUpper.has(upper) || (/^[A-Z0-9+]+$/.test(part) && /\d/.test(part)) || (/^[A-Z]{2,4}$/.test(part) && keepUpper.has(upper))) {
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
