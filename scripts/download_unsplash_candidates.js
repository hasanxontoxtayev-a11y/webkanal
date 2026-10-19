const fs = require('fs');
const https = require('https');
const path = require('path');

const ids = JSON.parse(fs.readFileSync('unsplash_ids.json', 'utf8'))
  .filter(id => id.startsWith('photo-1') || id.startsWith('photo-2'));

const targetDir = path.join(__dirname, '..', 'public', 'un_inspect');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&h=900&q=80`;
    const dest = path.join(targetDir, `${id}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      return resolve(dest);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      } else {
        file.close();
        fs.unlinkSync(dest);
        resolve(null);
      }
    }).on('error', () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(null);
    });
  });
}

async function run() {
  console.log(`Downloading ${ids.length} photos for inspection...`);
  let ok = 0;
  for (const id of ids) {
    const res = await download(id);
    if (res) ok++;
  }
  console.log(`Successfully downloaded ${ok} photos to public/un_inspect/`);
}

run();
