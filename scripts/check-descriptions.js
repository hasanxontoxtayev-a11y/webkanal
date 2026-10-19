const https = require('https');

function checkPage(id) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/photos/' + id, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        const descMatch = data.match(/name="description" content="([^"]+)"/i) || data.match(/property="og:description" content="([^"]+)"/i);
        resolve({
          id,
          title: titleMatch ? titleMatch[1] : '',
          desc: descMatch ? descMatch[1] : ''
        });
      });
    }).on('error', () => resolve({ id, title: 'err', desc: '' }));
  });
}

const list = [
  'photo-1521572267360-ee0c2909d518',
  'photo-1583743814966-8936f5b7be1a',
  'photo-1618354691373-d851c5c3a990',
  'photo-1503342217505-b0a15ec3261c',
  'photo-1527719327859-c6ce80353573',
  'photo-1581655353564-df123a1eb820',
  'photo-1562157873-818bc0726f68',
  'photo-1617137984095-74e4e5e3613f',
  'photo-1516826957135-700dedea698c',
  'photo-1620799140408-edc6dcb6d633',
  'photo-1614975058789-41316d0e2e9c',
  'photo-1556905055-8f358a7a47b2',
  'photo-1509967419530-da38b4704bc6',
  'photo-1578632767115-351597cf2477',
  'photo-1506629082955-511b1aa562c8',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1552902865-b72c031ac5ea',
  'photo-1541099649105-f69ad21f3246',
  'photo-1473966968600-fa801b869a1a',
  'photo-1624378439575-d8705ad7ae80',
  'photo-1551028719-00167b16eac5',
  'photo-1516257984-b1b4d707412e',
  'photo-1542327897-4141b355e20e',
  'photo-1576995853123-5a10305d93c0',
  'photo-1548883354-7622d03aca27',
  'photo-1544441893-675973e31985',
  'photo-1507679799987-c73779587ccf',
  'photo-1588850561407-ed78c282e89b',
  'photo-1576566588028-4147f3842f27',
  'photo-1553062407-98eeb64c6a62',
  'photo-1599643478518-a784e5dc4c8f',
  'photo-1627123424574-724758594e93',
  'photo-1584917865442-de89df76afd3'
];

Promise.all(list.map(checkPage)).then(results => {
  results.forEach(r => {
    console.log(r.id, '->', (r.title || '').slice(0, 40), '|', (r.desc || '').slice(0, 80));
  });
});
