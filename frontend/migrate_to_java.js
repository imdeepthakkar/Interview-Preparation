const fs = require('fs');
const path = require('path');

const javaDir = 'C:\\Users\\deept\\IdeaProjects\\Interview Preparation\\src\\com\\interview\\karat';
const scriptPath = 'C:\\Users\\deept\\IdeaProjects\\deepthakkar-project\\java-interview\\script.js';

let scriptContent = fs.readFileSync(scriptPath, 'utf8');
let match = scriptContent.match(/(const javaClasses = \[[\s\S]*?\n\];)/);
let extracted = match[1];
fs.writeFileSync('temp_data.js', extracted.replace('const javaClasses =', 'module.exports ='));
const javaClasses = require('./temp_data.js');

javaClasses.forEach(cls => {
    const filePath = path.join(javaDir, cls.title + '.java');
    if(fs.existsSync(filePath)) {
        let javaContent = fs.readFileSync(filePath, 'utf8');
        
        if(!javaContent.includes('// @Category')) {
            let header = `// @Title ${cls.title}\n// @Category ${cls.category}\n\n`;
            javaContent = javaContent.replace('public class', header + 'public class');
        }

        cls.parts.forEach((part, index) => {
            let partNumber = index + 1;
            if(!javaContent.includes(`// @Part ${partNumber}`)) {
                let trick = part.trick.replace(/\n/g, ' ');
                let analogy = part.analogy.replace(/\n/g, ' ');
                let subtitle = part.subtitle.replace(`Part ${partNumber}: `, '');
                let comment = `    // @Part ${partNumber}\n    // @Subtitle ${subtitle}\n    // @Analogy ${analogy}\n    // @Trick ${trick}\n    // @Time ${part.time}\n    // @Space ${part.space}\n`;
                
                let partRegex = new RegExp(`\\/\\*\\*?\\s*\\n\\s*\\*\\s*PART ${partNumber}:`, 'i');
                if(javaContent.match(partRegex)) {
                    javaContent = javaContent.replace(partRegex, comment + '    /*\n     * PART ' + partNumber + ':');
                } else {
                    let fallbackRegex = new RegExp(`PART ${partNumber}`, 'i');
                    if(javaContent.match(fallbackRegex)) {
                        javaContent = javaContent.replace(fallbackRegex, comment + '    // PART ' + partNumber);
                    }
                }
            }
        });
        
        fs.writeFileSync(filePath, javaContent);
        console.log("Updated", cls.title);
    }
});
