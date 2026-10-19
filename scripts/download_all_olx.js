const fs = require('fs');
const https = require('https');
const path = require('path');

const files = ['olx.html', 'olx_page2.html', 'olx_page3.html'];
let allUrls = [];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const html = fs.readFileSync(f, 'utf8');
    const regex = /https:\/\/[^"'\s]+apollo\.olxcdn\.com[^"'\s]+/g;
    const matches = html.match(regex) || [];
    console.log(f, 'found matches:', matches.length);
    matches.forEach(m => {
      // sanitize
      const clean = m.split(';')[0].replace(/\\/g, '');
      allUrls.push(clean);
    });
  }
});

const uniqueUrls = Array.from(new Set(allUrls));
console.log('Total unique OLX Apollo image links found:', uniqueUrls.length);

const targetDir = path.join(__dirname, '..', 'public', 'olx_all');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function download(url, filename) {
  return new Promise((resolve) => {
    https.get(url + ';s=1000x1000', (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => resolve(true));
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  const toDownload = uniqueUrls.slice(0, 100);
  console.log(`Downloading ${toDownload.length} images...`);
  let success = 0;
  for (let i = 0; i < toDownload.length; i++) {
    const p = path.join(targetDir, `img_${i + 1}.jpg`);
    const ok = await download(toDownload[i], p);
    if (ok) success++;
  }
  console.log(`Finished: ${success} images downloaded in public/olx_all/`);
}

run();
