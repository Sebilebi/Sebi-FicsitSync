async function main() {
  const js = await (await fetch('http://192.168.1.230:8080/public/static/assets/index-DrH0eZ0r.js')).text();

  function printContext(term, limit = 5) {
    console.log(`\n=== Context for: ${term} ===`);
    let idx = 0;
    let count = 0;
    while ((idx = js.indexOf(term, idx + 1)) !== -1 && count < limit) {
      console.log('--- Match ' + (count + 1) + ' ---');
      console.log(js.substring(Math.max(0, idx - 80), Math.min(js.length, idx + 250)));
      count++;
    }
  }

  printContext('resources/unarchive');
  printContext('cn("resources"');
  printContext('unarchive');
}

main().catch(console.error);
