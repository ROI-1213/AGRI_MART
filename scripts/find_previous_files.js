const fs = require('fs');
const readline = require('readline');

async function searchTranscriptFull() {
  const p = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\57b9500b-65c2-44b7-a6bc-347198713be4\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(p);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let pageEdits = [];
  let shopVersions = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          const path = tc.parameters?.Path || tc.parameters?.path;
          if (path && (path.includes('app/page.tsx') || path.includes('app\\page.tsx'))) {
            pageEdits.push({ step: obj.step_index, tc });
          }
          if (path && (path.includes('ShopByCategory.tsx'))) {
            shopVersions.push({ step: obj.step_index, tc });
          }
        }
      }
    } catch(e) {}
  }

  console.log('pageEdits count:', pageEdits.length);
  console.log('shopVersions count:', shopVersions.length);

  pageEdits.forEach((v, i) => console.log('page step:', v.step, v.tc.name, v.tc.parameters.Replacement ? 'edit' : 'write'));
  shopVersions.forEach((v, i) => console.log('shop step:', v.step, v.tc.name));

  if (shopVersions.length > 0) {
    const firstShop = shopVersions[0].tc.parameters.Content;
    if (firstShop) {
      fs.writeFileSync('components/ShopByCategory.tsx', firstShop);
      console.log('Successfully restored components/ShopByCategory.tsx from step', shopVersions[0].step);
    }
  }
}

searchTranscriptFull();
