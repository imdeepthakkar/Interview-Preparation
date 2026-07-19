const fs = require('fs');
const path = require('path');

const javaDir = path.join(__dirname, '../src/com/interview/karat');
const scriptPath = path.join(__dirname, 'script.js');

let scriptContent = fs.readFileSync(scriptPath, 'utf8');
const files = fs.readdirSync(javaDir).filter(f => f.endsWith('.java'));

let classesData = [];

files.forEach(file => {
    let javaContent = fs.readFileSync(path.join(javaDir, file), 'utf8');
    
    // Parse header
    let titleMatch = javaContent.match(/\/\/\s*@Title\s+(.+)/);
    let categoryMatch = javaContent.match(/\/\/\s*@Category\s+(.+)/);
    
    if(!titleMatch) return; // Skip if no @Title
    
    let cls = {
        id: titleMatch[1].toLowerCase().replace(/sequence$/, '').replace(/[^a-z0-9]/g, '-'),
        title: titleMatch[1],
        category: categoryMatch ? categoryMatch[1] : 'Uncategorized',
        parts: [],
        fullCode: javaContent.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')
    };

    // Split content into blocks by @Part
    let partBlocks = javaContent.split(/\/\/\s*@Part\s+/).slice(1);
    
    partBlocks.forEach(block => {
        let subtitle = (block.match(/\/\/\s*@Subtitle\s+(.+)/) || [])[1] || '';
        let analogy = (block.match(/\/\/\s*@Analogy\s+(.+)/) || [])[1] || '';
        let trick = (block.match(/\/\/\s*@Trick\s+(.+)/) || [])[1] || '';
        let time = (block.match(/\/\/\s*@Time\s+(.+)/) || [])[1] || '';
        let space = (block.match(/\/\/\s*@Space\s+(.+)/) || [])[1] || '';
        
        // Extract the code for this part.
        // It's everything after the comments until the end of the method.
        // For simplicity, we just extract the chunk between the comment block and the next part or end of file.
        // We look for the first public/private method.
        let codeChunk = block.substring(block.indexOf('/*')).trim();
        let methodMatch = codeChunk.match(/(public\s+static[\s\S]*?^    \})/m);
        if (methodMatch) {
            codeChunk = methodMatch[1];
        }
        
        cls.parts.push({
            subtitle: subtitle,
            analogy: analogy,
            trick: trick,
            time: time,
            space: space,
            code: codeChunk.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')
        });
    });
    
    classesData.push(cls);
});

// Serialize to JS code
let newArrayStr = 'const javaClasses = [\n';
classesData.forEach((cls, i) => {
    newArrayStr += `    {\n        id: "${cls.id}",\n        title: "${cls.title}",\n        category: "${cls.category}",\n`;
    newArrayStr += `        fullCode: \`${cls.fullCode}\`,\n        parts: [\n`;
    cls.parts.forEach((p, j) => {
        newArrayStr += `            {\n                subtitle: "${p.subtitle}",\n                analogy: "${p.analogy}",\n                trick: "${p.trick}",\n                time: "${p.time}", space: "${p.space}",\n                code: \`${p.code}\`\n            }${j < cls.parts.length - 1 ? ',' : ''}\n`;
    });
    newArrayStr += `        ]\n    }${i < classesData.length - 1 ? ',' : ''}\n`;
});
newArrayStr += '];\n';

// Replace in script.js
let newScript = scriptContent.replace(/const javaClasses = \[[\s\S]*?\];\s*\/\/\s*App State/m, newArrayStr + '\n// App State');
fs.writeFileSync(scriptPath, newScript);

console.log("Successfully rebuilt script.js from Java comments!");
