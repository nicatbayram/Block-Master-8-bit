const fs = require('fs');
const path = require('path');

const dirs = ['screens', 'components'];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js') && f !== 'SettingsScreen.js'); // We'll do SettingsScreen manually
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Only process if it imports COLORS
    if (content.includes('COLORS')) {
      // 1. Replace import
      // Find the exact import line
      content = content.replace(/import\s+\{\s*COLORS\w*(?:,\s*\w+)*\s*\}\s+from\s+['"]([^'"]+)['"];/, (match, p1) => {
        // determine relative path depth
        const depth = p1.startsWith('../../') ? '../../' : '../';
        return `import { useTheme } from '${depth}contexts/ThemeContext';\nimport { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '${depth}constants/colors';`;
      });
      // also if just importing COLORS but it might not have matched if it's already refactored
      if(content.includes('import { COLORS } from')) {
        content = content.replace(/import\s+\{\s*COLORS\s*\}\s+from\s+['"][^'"]+['"];/, `import { useTheme } from '../contexts/ThemeContext';`);
      }

      // 2. Change styles
      const hasStyles = content.includes('const styles = StyleSheet.create(');
      if (hasStyles) {
        content = content.replace('const styles = StyleSheet.create(', 'const getStyles = (COLORS) => StyleSheet.create(');
      }

      // 3. Insert hook into functional component
      // We look for: const ComponentName = ... => {
      // Because we know filenames match component names usually, but let's match UpperCase names
      // Or simply look for the first definition of `const [A-Z]\w+\s*=\s*(forwardRef\()?\(.*?\)\s*=>\s*\{`
      const componentRegex = /const\s+([A-Z]\w+)\s*=\s*(?:forwardRef\()?\s*(\([^)]*\)\s*=>\s*\{)/;
      const match = content.match(componentRegex);
      if (match) {
        const insertion = `\n  const { colors: COLORS } = useTheme();` + (hasStyles ? `\n  const styles = getStyles(COLORS);` : '');
        content = content.replace(componentRegex, `const $1 = ${match[0].includes('forwardRef') ? 'forwardRef(' : ''}$2${insertion}`);
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Refactored ${file}`);
    }
  });
});
