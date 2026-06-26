const fs = require('fs');
const lines = fs.readFileSync('C:/Users/truong/.gemini/antigravity-ide/brain/67239a43-35b1-45c4-9019-8fc9734b8000/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

for (const l of lines) {
  if (l.includes('openapi') && l.includes('components')) {
    try {
      const parsed = JSON.parse(l);
      // parsed.content has the raw <USER_REQUEST> ... JSON ... </USER_REQUEST>
      const content = parsed.content || "";
      const jsonStrMatch = content.match(/{"openapi":"3\.1\.0".+}/);
      if (jsonStrMatch) {
        const api = JSON.parse(jsonStrMatch[0]);
        console.log("LoginRequest:", JSON.stringify(api.components?.schemas?.LoginRequest, null, 2));
        console.log("LoginRequest Path:", JSON.stringify(api.paths['/api/auth/admin/login'] || api.paths['/api/users/login'], null, 2));
        break;
      }
    } catch(e) {
      // ignore
    }
  }
}
