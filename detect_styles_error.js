const fs = require('fs');
const path = require('path');

const dirs = ['screens', 'components'];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Simple check: does it have "styles." more times than "getStyles" + 1 ?
    // Or just look for "const ComponentName = ({...}) => {" that doesn't have getStyles right after
    const componentRegex = /const\s+([A-Z]\w+)\s*=\s*(?:forwardRef\()?\s*(\([^)]*\)\s*=>\s*\{)/g;
    let match;
    while ((match = componentRegex.exec(content)) !== null) {
      const componentName = match[1];
      // Check the next 100 characters to see if `getStyles` is there
      const followingText = content.substring(match.index, match.index + 200);
      if (!followingText.includes('getStyles') && !followingText.includes('styles =')) {
        // Also check if this component actually uses `styles.`
        // We can just print it and check manually
        console.log(`Potential issue in ${file}: Component ${componentName} might be missing styles.`);
      }
    }
  });
});
