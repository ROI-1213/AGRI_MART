import { Product } from '@/types';

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
