import { Product } from '@/types';

export interface DescriptionField {
  key: string | null;
  value: string;
}

const KNOWN_SPEC_KEYS = [
  'Model', 'Engine Model', 'Engine Type', 'Engine type', 'Engine', 'Motor Power', 'Motor', 
  'Power Output - Max', 'Power Output -Max', 'Power Output', 'Power / Displacement', 'Power/Displacement', 'Power',
  'Displacement', 'Fuel Tank Capacity', 'Fuel tank Capacity', 'Fuel tank capacity', 'Chemical tank Capacity',
  'Liquid tank capacity', 'Collection bag capacity', 'Tank Capacity', 'Tank Material', 'Tank / Bag Capacity',
  'Battery Power', 'Battery Specification', 'Battery', 'Voltage', 'Frequency',
  'Lance /Piston', 'Lance/Piston', 'Lance', 'Working Pressure', 'Pump Discharge', 'Max Pressure', 'Pressure',
  'Ditching Width', 'Ditching Depth', 'Cultivating Width', 'Cultivating Depth', 'Tilling Width', 'Tilling Depth',
  'Working Width', 'Working Depth', 'Gear', 'Gears', 'Transmission',
  'Max air Volume', 'Max air Speed', 'Max. air flow', 'Max. air Speed', 'Air Volume', 'Air Speed',
  'Dry Weight without blower tube', 'Dry Weight', 'Net Weight', 'Weight',
  'RPM', 'Single speed', 'Single Speed', 'Speed', 'Rated Speed',
  'Type of Handle', 'Tube Diameter', 'Tube diameter', 'Diameter',
  'Cutting components', 'Cutting Components', 'Guide Bar Size', 'Guide Bar Length', 'Bar Length(Nose)', 'Bar Length (Optional)', 'Bar Length', 'Bar length (nose)',
  'Oil Tank Capacity', 'Oil Pump', 'Chain (pitch x gauge)', 'Chain', 'Bore x Stroke', 'Carburetor', 'Chopping Capacity',
  'Blades', 'Grip', 'Start', 'Type', 'Fuel Consumption', 'Drive', 'Blade Length'
];

export function parseProductDescription(desc: string): DescriptionField[] {
  if (!desc || !desc.trim()) return [];

  const escaped = KNOWN_SPEC_KEYS
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|');

  const pattern = new RegExp('(?:^|\\s)((' + escaped + ')\\s*[:;]\\s*)', 'gi');
  const matches = [...desc.matchAll(pattern)];

  if (matches.length === 0) {
    return [{ key: null, value: desc.trim() }];
  }

  const results: DescriptionField[] = [];
  const firstKeyPos = (matches[0].index ?? 0) + matches[0][0].indexOf(matches[0][1]);
  const prefix = desc.slice(0, firstKeyPos).trim();
  if (prefix) {
    results.push({ key: null, value: prefix });
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const key = m[2].trim();
    const valStart = (m.index ?? 0) + m[0].length;
    let nextKeyPos = desc.length;
    if (i + 1 < matches.length) {
      const nextM = matches[i + 1];
      nextKeyPos = (nextM.index ?? 0) + nextM[0].indexOf(nextM[1]);
    }
    const value = desc.slice(valStart, nextKeyPos).trim();
    results.push({ key, value });
  }

  return results;
}

export function extractProductSpecs(product: Product): Array<{ label: string; value: string }> {
  const specs: Array<{ label: string; value: string }> = [];

  // 1. Existing structured specifications (excluding Brand, RIPL Code, and Warranty)
  if (product.specifications && Object.keys(product.specifications).length > 0) {
    Object.entries(product.specifications).forEach(([k, v]) => {
      const cleanKey = k.trim();
      const lowerKey = cleanKey.toLowerCase();
      if (
        v && 
        v.trim() !== '' && 
        !/brand/i.test(lowerKey) && 
        !/model/i.test(lowerKey) && 
        !/code/i.test(lowerKey) && 
        !/warranty/i.test(lowerKey)
      ) {
        specs.push({ label: cleanKey, value: v.trim() });
      }
    });
  }

  // 2. Parse from description if specifications are empty or sparse
  const desc = product.description || '';

  // Tank / Bag Capacity
  const tankMatch = desc.match(/(?:fuel\s*tank\s*capacity|tank\s*\/?\s*bag\s*capacity|collection\s*bag\s*capacity|tank\s*capacity|capacity)\s*[:\-]?\s*([0-9.]+\s*(?:ltrs?|liters?|litres?|l\b|ml))/i);
  if (tankMatch && !specs.some(s => /capacity|tank/i.test(s.label))) {
    specs.push({ label: 'Tank / Bag Capacity', value: tankMatch[1].trim() });
  }

  // Engine Power / HP / kW
  const powerMatch = desc.match(/(?:power|output)\s*[:\-]?\s*([0-9.]+\s*(?:hp|kw|watt|w\b)[^,.\n<]*)/i);
  if (powerMatch && !specs.some(s => /power/i.test(s.label))) {
    specs.push({ label: 'Power Output', value: powerMatch[1].trim() });
  }

  // RPM / Speed
  const speedMatch = desc.match(/(?:speed|rpm|rated\s*speed)\s*[:\-]?\s*([0-9.,]+\s*(?:rpm|r\/min|m\/s))/i);
  if (speedMatch && !specs.some(s => /speed|rpm/i.test(s.label))) {
    specs.push({ label: 'Operating Speed', value: speedMatch[1].trim() });
  }

  // Displacement (CC)
  const dispMatch = desc.match(/(?:displacement)\s*[:\-]?\s*([0-9.]+\s*(?:cc|cm3|cm³))/i);
  if (dispMatch && !specs.some(s => /displacement/i.test(s.label))) {
    specs.push({ label: 'Engine Displacement', value: dispMatch[1].trim() });
  }

  // Engine Type / Stroke
  const engineMatch = desc.match(/(?:engine)\s*[:\-]?\s*([^.,\n<]+(?:stroke|cylinder|diesel|petrol|electric|brushless)[^.,\n<]*)/i);
  if (engineMatch && !specs.some(s => /engine/i.test(s.label))) {
    specs.push({ label: 'Engine Type', value: engineMatch[1].trim() });
  }

  // Air Volume / Flow Rate
  const airVolMatch = desc.match(/(?:max\.?\s*air\s*volume|air\s*flow\s*rate|air\s*volume)\s*[:\-]?\s*([0-9.]+\s*(?:m3\/hr|m³\/hr|m³\/min|m3\/min))/i);
  if (airVolMatch && !specs.some(s => /air volume|flow/i.test(s.label))) {
    specs.push({ label: 'Air Flow / Volume', value: airVolMatch[1].trim() });
  }

  // Air Speed
  const airSpeedMatch = desc.match(/(?:max\.?\s*air\s*speed|air\s*speed)\s*[:\-]?\s*([0-9.]+\s*(?:m\/s|km\/h|km\/hr))/i);
  if (airSpeedMatch && !specs.some(s => /speed/i.test(s.label))) {
    specs.push({ label: 'Max Air Speed', value: airSpeedMatch[1].trim() });
  }

  // Weight
  const weightMatch = desc.match(/(?:dry weight|weight|net weight)\s*[:\-]?\s*([0-9.]+\s*(?:kg|kgs?|grams?))/i);
  if (weightMatch && !specs.some(s => /weight/i.test(s.label))) {
    specs.push({ label: 'Weight', value: weightMatch[1].trim() });
  }

  // Working Width / Tilling Width
  const widthMatch = desc.match(/(?:tilling width|working width|cultivating width|width)\s*[:\-]?\s*([0-9.]+\s*(?:mm|cm|meters?|m|inches?))/i);
  if (widthMatch && !specs.some(s => /width/i.test(s.label))) {
    specs.push({ label: 'Working Width', value: widthMatch[1].trim() });
  }

  // Working Depth / Cultivating Depth
  const depthMatch = desc.match(/(?:cultivating depth|ditching depth|working depth|depth)\s*[:\-]?\s*([0-9.]+\s*(?:mm|cm|meters?|m|inches?))/i);
  if (depthMatch && !specs.some(s => /depth/i.test(s.label))) {
    specs.push({ label: 'Working Depth', value: depthMatch[1].trim() });
  }

  // Core Standard Identity Specs
  specs.push({ label: 'Category', value: product.category });
  specs.push({ label: 'Government Subsidy', value: 'Eligible under State/Central Farm Mechanization (SMAM)' });

  return specs;
}
