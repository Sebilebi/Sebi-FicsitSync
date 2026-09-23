const https = require('https');

function checkUrl(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD' }, res => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => resolve({ url, status: 0 }));
    req.setTimeout(3000, () => { req.destroy(); resolve({ url, status: 0 }); });
    req.end();
  });
}

async function run() {
  console.log('Testing SCIM tile zoom levels and layers...');
  
  // 1. Test zoom 0 to 4
  for (let z = 0; z <= 4; z++) {
    const maxCoord = Math.pow(2, z);
    const checks = [];
    for (let x = 0; x < maxCoord; x++) {
      for (let y = 0; y < maxCoord; y++) {
        checks.push({ z, x, y });
      }
    }
    let ok = 0;
    for (const c of checks) {
      const res = await checkUrl('https://static.satisfactory-calculator.com/imgMap/realisticLayer/Stable/' + c.z + '/' + c.x + '/' + c.y + '.png');
      if (res.status === 200) ok++;
    }
    console.log('realisticLayer z=' + z + ': ' + ok + ' / ' + checks.length + ' tiles exist');
  }

  // 2. Also check gameLayer
  for (let z = 0; z <= 2; z++) {
    const maxCoord = Math.pow(2, z);
    const checks = [];
    for (let x = 0; x < maxCoord; x++) {
      for (let y = 0; y < maxCoord; y++) {
        checks.push({ z, x, y });
      }
    }
    let ok = 0;
    for (const c of checks) {
      const res = await checkUrl('https://static.satisfactory-calculator.com/imgMap/gameLayer/Stable/' + c.z + '/' + c.x + '/' + c.y + '.png');
      if (res.status === 200) ok++;
    }
    console.log('gameLayer z=' + z + ': ' + ok + ' / ' + checks.length + ' tiles exist');
  }
}

run();
