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
    
    ${title === 'Study Priority List' ? `
    <style>
        .priority-block {
            padding: 15px 20px;
            margin-bottom: 20px;
            border: 2px dashed transparent;
            border-radius: 8px;
            transition: all 0.3s ease;
            position: relative;
            background: rgba(255, 255, 255, 0.5);
            list-style-position: inside;
        }
        .priority-block:hover {
            border-color: var(--blue-line);
        }
        .priority-block.done {
            opacity: 0.5;
            border-color: #2ecc71;
            background-color: rgba(46, 204, 113, 0.1);
        }
        .mark-done-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: 2px solid var(--ink);
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-weight: bold;
            padding: 5px 12px;
            color: var(--ink);
            transition: 0.2s;
        }
        .priority-block.done .mark-done-btn {
            background: #2ecc71;
            color: white;
            border-color: #2ecc71;
        }
    </style>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const listItems = document.querySelectorAll('ol > li');
        
        listItems.forEach((li, index) => {
            li.classList.add('priority-block');
            
            const btn = document.createElement('button');
            btn.className = 'mark-done-btn';
            btn.innerText = 'Mark as Done';
            
            const qId = 'priority_q_' + index;
            if (localStorage.getItem(qId) === 'true') {
                li.classList.add('done');
                btn.innerText = '✓ Done';
            }
            
            btn.onclick = () => {
                const isDone = li.classList.toggle('done');
                localStorage.setItem(qId, isDone);
                btn.innerText = isDone ? '✓ Done' : 'Mark as Done';
            };
            
            li.appendChild(btn);
        });
    });
    </script>
    ` : ''}

    ${title === '150 Rapid-Fire Q&A' ? `
    <style>
        .question-block {
            padding: 15px 20px;
            margin-bottom: 20px;
            border: 2px dashed transparent;
            border-radius: 8px;
            transition: all 0.3s ease;
            position: relative;
            background: rgba(255, 255, 255, 0.5);
        }
        .question-block:hover {
            border-color: var(--blue-line);
        }
        .question-block.done {
            opacity: 0.5;
            border-color: #2ecc71;
            background-color: rgba(46, 204, 113, 0.1);
        }
        .mark-done-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: 2px solid var(--ink);
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-weight: bold;
            padding: 5px 12px;
            color: var(--ink);
            transition: 0.2s;
        }
        .question-block.done .mark-done-btn {
            background: #2ecc71;
            color: white;
            border-color: #2ecc71;
        }
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 40px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        .page-btn {
            padding: 10px 15px;
            border: 2px solid var(--ink);
            background: white;
            cursor: pointer;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-weight: bold;
            transition: 0.2s;
        }
        .page-btn:hover { background: #f0f0f0; }
        .page-btn.active {
            background: var(--highlight);
        }
        .hidden {
            display: none !important;
        }
    </style>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.container');
        const elements = Array.from(container.children);
        
        let currentBlock = null;
        let allBlocks = [];
        
        elements.forEach(el => {
            if (el.tagName === 'HEADER' || el.tagName === 'H1') return;
            
            if (el.tagName === 'H2') {
                currentBlock = document.createElement('div');
                currentBlock.className = 'category-header';
                currentBlock.appendChild(el.cloneNode(true));
                allBlocks.push(currentBlock);
                el.style.display = 'none';
                return;
            }
            
            if (el.tagName === 'P' && el.innerHTML.match(/<strong>Q\\d+/i)) {
                currentBlock = document.createElement('div');
                currentBlock.className = 'question-block';
                
                const btn = document.createElement('button');
                btn.className = 'mark-done-btn';
                btn.innerText = 'Mark as Done';
                
                const match = el.innerText.match(/Q(\\d+)/i);
                if (match) {
                    const qId = 'rapid_fire_' + match[1];
                    if (localStorage.getItem(qId) === 'true') {
                        currentBlock.classList.add('done');
                        btn.innerText = '✓ Done';
                    }
                    
                    btn.onclick = () => {
                        const isDone = currentBlock.classList.toggle('done');
                        localStorage.setItem(qId, isDone);
                        btn.innerText = isDone ? '✓ Done' : 'Mark as Done';
                    };
                }
                
                currentBlock.appendChild(btn);
                currentBlock.appendChild(el.cloneNode(true));
                allBlocks.push(currentBlock);
                el.style.display = 'none';
            } else if (currentBlock && currentBlock.className === 'question-block') {
                currentBlock.appendChild(el.cloneNode(true));
                el.style.display = 'none';
            }
        });
        
        allBlocks.forEach(block => container.appendChild(block));
        
        const QUESTIONS_PER_PAGE = 15;
        const questionBlocks = allBlocks.filter(b => b.className === 'question-block');
        const totalPages = Math.ceil(questionBlocks.length / QUESTIONS_PER_PAGE);
        let currentPage = 1;
        
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        container.appendChild(paginationContainer);
        
        function renderPage(page) {
            currentPage = page;
            allBlocks.forEach(b => b.classList.add('hidden'));
            
            const startIdx = (page - 1) * QUESTIONS_PER_PAGE;
            const endIdx = startIdx + QUESTIONS_PER_PAGE;
            
            const pageQuestions = questionBlocks.slice(startIdx, endIdx);
            pageQuestions.forEach(q => q.classList.remove('hidden'));
            
            let visibleH2s = new Set();
            pageQuestions.forEach(q => {
                const idx = allBlocks.indexOf(q);
                for(let i = idx - 1; i >= 0; i--) {
                    if(allBlocks[i].className === 'category-header') {
                        visibleH2s.add(allBlocks[i]);
                        break;
                    }
                }
            });
            visibleH2s.forEach(h2 => h2.classList.remove('hidden'));
            
            renderPaginationButtons();
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
        
        function renderPaginationButtons() {
            paginationContainer.innerHTML = '';
            for(let i=1; i<=totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
                btn.innerText = i;
                btn.onclick = () => renderPage(i);
                paginationContainer.appendChild(btn);
            }
        }
        
        if (questionBlocks.length > 0) {
            renderPage(1);
        }
    });
    </script>
    ` : ''}
</body>
</html>`;
}

fs.writeFileSync('priority.html', generateHtml('Study Priority List', priorityContent));
fs.writeFileSync('rapid-fire.html', generateHtml('150 Rapid-Fire Q&A', rapidFireContent));

console.log("Notebook themed HTML generated!");
