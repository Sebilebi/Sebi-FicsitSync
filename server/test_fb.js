const http = require('http');

async function main() {
  // 1. Authenticate
  const loginRes = await fetch('http://192.168.1.230:8080/api/auth/login?username=admin', {
    method: 'POST',
    headers: {
      'X-Password': encodeURIComponent('homelab22'),
      'X-Secret': ''
    }
  });

  const token = await loginRes.text();
  console.log('Got JWT Token:', token.substring(0, 30) + '...');

  // 2. Test GET /api/resources/
  const res = await fetch('http://192.168.1.230:8080/api/resources/', {
    headers: {
      'X-Auth': token,
      'Cookie': `filebrowser_quantum_jwt=${token}`
    }
  });

  console.log('GET /api/resources/ Status:', res.status);
  const data = await res.json();
  console.log('Root resources:', data);

  // 3. Check /api/resources/web or /api/resources/srv/web
  const resWeb = await fetch('http://192.168.1.230:8080/api/resources/web', {
    headers: {
      'X-Auth': token,
      'Cookie': `filebrowser_quantum_jwt=${token}`
    }
  });
  console.log('GET /api/resources/web Status:', resWeb.status);
  if (resWeb.ok) {
    const webData = await resWeb.json();
    console.log('Web folder contents:', webData.items?.map(i => ({ name: i.name, isDir: i.isDir, size: i.size })));
  } else {
    console.log(await resWeb.text());
  }
}

main().catch(console.error);
