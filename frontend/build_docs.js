const fs = require('fs');
const marked = require('marked');

// Read markdown files from the parent directory
const priorityContent = fs.readFileSync('../Study_Priority.md', 'utf8').replace(/<style>[\s\S]*?<\/style>/, '');
const javaContent = fs.readFileSync('../Rapid_Fire_Java.md', 'utf8').replace(/<style>[\s\S]*?<\/style>/, '');
const springArchContent = fs.readFileSync('../Rapid_Fire_Spring_Arch.md', 'utf8').replace(/<style>[\s\S]*?<\/style>/, '');

const rapidFireContent = javaContent + "\n\n" + springArchContent;

function generateHtml(title, markdownText) {
    const htmlContent = marked.parse(markdownText);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Notebook Edition</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Specific overrides for the markdown content to align with the lined paper */
        h1, h2, h3 { color: var(--highlight-dark); margin-top: 32px; margin-bottom: 0px; line-height: 32px; font-family: 'Caveat', cursive; font-size: 2rem;}
        h1 { font-size: 2.5rem; border-bottom: 2px dashed var(--highlight); }
        p, li { line-height: 32px; margin: 0; padding-top: 6px; padding-bottom: 6px; }
        ul { padding-left: 20px; margin: 0; }
        strong { color: var(--red-pen); }
    </style>
</head>
<body>
    <div class="margin-line"></div>
    <div class="container">
        <header style="margin-bottom: 32px;">
            <a href="/java-interview/" style="text-decoration: none; padding: 5px 15px; background-color: var(--highlight); color: var(--ink); border: 2px solid var(--ink); border-radius: 8px; font-weight: bold; font-family: 'Inter', sans-serif; font-size: 0.9rem;">⬅ Back to Notebook</a>
        </header>
        ${htmlContent}
    </div>
</body>
</html>`;
}

fs.writeFileSync('priority.html', generateHtml('Study Priority List', priorityContent));
fs.writeFileSync('rapid-fire.html', generateHtml('150 Rapid-Fire Q&A', rapidFireContent));

console.log("Notebook themed HTML generated!");
