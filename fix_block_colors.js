const fs = require('fs');
const path = require('path');

const dirs = ['screens', 'components'];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('BLOCK_COLORS')) {
      // Replace BLOCK_COLORS[...] with COLORS.blockColors[...] securely
      // but ensure we don't accidentally replace BLOCK_COLORS_LIGHT
      let modified = content.replace(/BLOCK_COLORS(\[|\.)/g, 'COLORS.blockColors$1');
      if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`Fixed BLOCK_COLORS in ${file}`);
      }
    }
  });
});
