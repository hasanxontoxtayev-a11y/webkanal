const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('olx_images.json', 'utf8'));
const targetDir = path.join(__dirname, '..', 'public', 'olx_raw');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(resolve);
        });
      } else {
        resolve(null);
      }
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log(`Starting download of ${urls.length} images...`);
  let count = 0;
  for (let i = 0; i < urls.length; i++) {
    const rawUrl = urls[i];
    // Form high quality link
    // Apollo URLs can have ;s=1000x1000 or ;s=1000x700
    const cleanBase = rawUrl.split(';')[0];
    const dlUrl = cleanBase + ';s=1000x1000';
    const filePath = path.join(targetDir, `olx_${i + 1}.jpg`);
    await download(dlUrl, filePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      count++;
    }
  }
  console.log(`Downloaded ${count} images to public/olx_raw/`);
}

run();
