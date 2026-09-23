const FB_BASE = 'http://192.168.1.230:8080';
const FB_USER = 'admin';
const FB_PASS = 'homelab22';
const FB_SOURCE = 'srv';
const SAVES_PATH = '/saved/server';

async function test() {
  const loginRes = await fetch(`${FB_BASE}/api/auth/login?username=${encodeURIComponent(FB_USER)}`, {
    method: 'POST',
    headers: { 'X-Password': encodeURIComponent(FB_PASS), 'X-Secret': '' }
  });
  const authToken = (await loginRes.text()).trim();
  
  const headers = { 'Cookie': `filebrowser_quantum_jwt=${authToken}` };
  
  const listRes = await fetch(`${FB_BASE}/api/resources?source=${FB_SOURCE}&path=${encodeURIComponent(SAVES_PATH)}`, { headers });
  const listData = await listRes.json();
  
  const savFiles = (listData.files || [])
      .filter(f => f.name.endsWith('.sav'))
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
      
  console.log('Top 5 files:');
  for (let i = 0; i < Math.min(5, savFiles.length); i++) {
    console.log(savFiles[i].name, savFiles[i].modified, new Date(savFiles[i].modified).getTime());
  }
}
test();
