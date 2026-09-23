async function main() {
  const js = await (await fetch('https://static.satisfactory-calculator.com/js/InteractiveMap/build/SCIM.js?v=1787922668')).text();
  console.log('SCIM.js length:', js.length);

  // Search for background / tile / layers in SCIM.js
  const regex = /\{z\}\/\{x\}\/\{y\}/g;
  let idx = 0;
  while ((idx = js.indexOf('{z}', idx + 1)) !== -1) {
    console.log('--- Context around {z} ---');
    console.log(js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 150)));
  }

  // Search for map layers
  const layerIdx = js.indexOf('backgroundLayers');
  if (layerIdx !== -1) {
    console.log('--- backgroundLayers ---');
    console.log(js.substring(layerIdx, layerIdx + 300));
  }
}

main().catch(console.error);
