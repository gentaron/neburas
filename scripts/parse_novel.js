import fs from 'fs';
import path from 'path';

// Input file
const inputFile = path.resolve('NEbu.txt');
// Output file
const outputDir = path.resolve('src/data');
const outputFile = path.join(outputDir, 'novel.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

try {
    const text = fs.readFileSync(inputFile, 'utf-8');

    // Split by standard chapter headers (e.g., 第一章, 第二章)
    // Adjust regex to capture the full header line as the title
    // The pattern looks for start of line, optional whitespace, chapter number chars, '章', then title
    // Example: 6: 第一章: アルファ・ケインの目覚め
    // But the file content I saw had line numbers added by the tool view? 
    // Wait, the tool view said "The following code has been modified to include a line number".
    // So the actual file doesn't have "6: ". It just has "第一章: アルファ・ケインの目覚め".

    // Regex: Match "第" followed by kanji numbers or decimals, then "章", followed by colon or space, then title
    // We'll capture the whole line as the title.

    // Let's use a split strategy where we identify the start of chapters.
    // However, the first few lines might be prologue/intro.
    // Line 1: 星々の交響曲 (Title?)
    // Line 6: 第一章: ...

    const lines = text.split(/\r?\n/);
    const chapters = [];
    let currentChapter = {
        id: 'prologue',
        title: '序章',
        content: []
    };

    const chapterRegex = /^第[一二三四五六七八九十0-9]+章/;

    for (let line of lines) {
        line = line.trim();
        if (chapterRegex.test(line)) {
            // New chapter found
            // Push old chapter if it has content (or if it's the prologue)
            if (currentChapter.content.length > 0) {
                chapters.push({
                    ...currentChapter,
                    content: currentChapter.content.join('\n')
                });
            }

            // Start new chapter
            currentChapter = {
                id: `chapter-${chapters.length}`,
                title: line,
                content: []
            };
        } else {
            // Add to current chapter
            // Preserve empty lines as structural breaks, but maybe trim excessive ones later
            currentChapter.content.push(line);
        }
    }

    // Push the last chapter
    if (currentChapter.content.length > 0) {
        chapters.push({
            ...currentChapter,
            content: currentChapter.content.join('\n')
        });
    }

    // Fix IDs to be sequential properly 1-based index if preferred, or maintain prologue
    chapters.forEach((ch, index) => {
        ch.id = index.toString();
    });

    fs.writeFileSync(outputFile, JSON.stringify(chapters, null, 2), 'utf-8');
    console.log(`Successfully parsed ${chapters.length} chapters.`);

} catch (err) {
    console.error('Error parsing novel:', err);
    process.exit(1);
}
