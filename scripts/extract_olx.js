const fs = require('fs');

if (fs.existsSync('olx.html')) {
  const html = fs.readFileSync('olx.html', 'utf8');
  console.log('olx.html size:', html.length);
  
  // Find all Apollo CDN image URLs
  const regex = /https:\/\/[^"'\s\\]+apollo\.olxcdn\.com[^"'\s\\]+/g;
  const matches = html.match(regex) || [];
  console.log('Total matches found:', matches.length);
  
  // Filter for high resolution image URLs
  // Apollo URLs usually have ;s=644x461 or ;s=1000x700 or similar
  const cleanUrls = Array.from(new Set(matches.map(url => {
    // replace size with high-res or keep clean
    return url.replace(/;s=\d+x\d+/, ';s=1000x1000');
  })));
  
  console.log('Unique high-res image URLs:', cleanUrls.length);
  fs.writeFileSync('olx_images.json', JSON.stringify(cleanUrls.slice(0, 80), null, 2));
} else {
  console.log('olx.html not found');
}
