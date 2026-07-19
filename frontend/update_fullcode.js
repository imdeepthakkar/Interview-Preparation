const fs = require('fs');
const path = require('path');

const javaDir = 'C:\\Users\\deept\\IdeaProjects\\Interview Preparation\\src\\com\\interview\\karat';
const scriptPath = 'C:\\Users\\deept\\IdeaProjects\\deepthakkar-project\\java-interview\\script.js';

let scriptContent = fs.readFileSync(scriptPath, 'utf8');

const files = fs.readdirSync(javaDir).filter(f => f.endsWith('.java'));

files.forEach(file => {
    const className = file.replace('.java', '');
    const code = fs.readFileSync(path.join(javaDir, file), 'utf8');
    
    // We need to inject fullCode before `parts: [`
    const regex = new RegExp(`title:\\s*"${className}",\\s*category:\\s*"[^"]+",`, 'g');
    scriptContent = scriptContent.replace(regex, match => {
        // Escape backticks and ${} in the code
        const safeCode = code.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${');
        return `${match}\n        fullCode: \`${safeCode}\`,`;
    });
});

fs.writeFileSync(scriptPath, scriptContent);
console.log('Successfully injected fullCode!');
