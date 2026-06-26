const fs = require('fs');
const lines = fs.readFileSync('C:/Users/truong/.gemini/antigravity-ide/brain/67239a43-35b1-45c4-9019-8fc9734b8000/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

for (const l of lines) {
  if (l.includes('openapi') && l.includes('title')) {
    try {
      const parsed = JSON.parse(l);
      const content = parsed.content || "";
      const start = content.indexOf('{"openapi"');
      if (start !== -1) {
        let jsonStr = content.substring(start);
        jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);
        fs.writeFileSync('openapi_extracted.json', jsonStr);
        console.log("Extracted openapi to openapi_extracted.json");
        break;
      }
    } catch(e) {}
  }
}
