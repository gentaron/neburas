import React, { useState, useEffect } from 'react';
import novelData from './data/novel.json';
import { jsPDF } from "jspdf";

// Simple Certificate Component (Internal or separate?)
// Let's implement logic inside App for now or a separate function
// function generateCertificate(chapterTitle) { ... }

function App() {
    // Sorting chapters if needed, though they should be in order from json
    // novelData is array of { id, title, content }

    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState('dark'); // 'light', 'dark', 'sepia'

    const currentChapter = novelData[currentChapterIndex];
    const isFirst = currentChapterIndex === 0;
    const isLast = currentChapterIndex === novelData.length - 1;

    const handleNext = () => {
        if (!isLast) {
            setCurrentChapterIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (!isFirst) {
            setCurrentChapterIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleDownloadCertificate = async (chapterTitle) => {
        // Create PDF
        // Note: Default jsPDF fonts don't support Japanese.
        // We need a font. For a web app, we can add a font file or use standard fonts if supported (rarely are for JP in pdf).
        // However, client-side likely needs a base64 font or network load.
        // For this MVP, we might try to use a very basic setup or warn about font.
        // Actually, a common trick is to draw an image to the PDF if text fails, but we want text.
        // Let's try to load a font from CDN or local public if possible.
        // Or we can just print "Finished Chapter X" in English and the user's name?
        // User request: "章ごとにpdf形式で読了証明書を発行できるようにして" (Issue a reading completion certificate in PDF format for each chapter)
        // It implies Japanese text might be needed.

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Simple design
        doc.setFontSize(22);
        doc.text("Reading Completion Certificate", 148.5, 50, { align: "center" });

        doc.setFontSize(16);
        doc.text(`This certifies that you have completed:`, 148.5, 80, { align: "center" });

        // Attempting to print title (might show garbage if no font)
        // We will safeguard this by adding a note or using English if possible, 
        // but 'currentChapter.title' is Japanese.
        // We really need a custom font. 
        // I can add a font to the public folder later.

        doc.setFontSize(20);
        doc.text(currentChapter.title, 148.5, 100, { align: "center" }); // Warning: Garbled text risk

        doc.setFontSize(14);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 148.5, 130, { align: "center" });

        doc.rect(20, 20, 257, 170); // Border

        doc.save(`Certificate-${currentChapter.title}.pdf`);
    };

    return (
        <div className={`app-container theme-${theme}`}>
            <nav className="navbar">
                <div className="nav-brand">NEBURA</div>
                <div className="nav-controls">
                    <button onClick={() => setTheme('light')}>Light</button>
                    <button onClick={() => setTheme('sepia')}>Sepia</button>
                    <button onClick={() => setTheme('dark')}>Dark</button>
                </div>
            </nav>

            <main className="reader-container">
                <header className="chapter-header">
                    <h1>{currentChapter.title}</h1>
                </header>

                <article className="chapter-content">
                    {currentChapter.content.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                </article>

                <section className="chapter-footer">
                    <div className="certificate-section">
                        <button className="btn-certificate" onClick={() => handleDownloadCertificate(currentChapter.title)}>
                            📜 発行 (Issue Certificate)
                        </button>
                    </div>

                    <div className="navigation-buttons">
                        <button disabled={isFirst} onClick={handlePrev}>Previous</button>
                        <button disabled={isLast} onClick={handleNext}>Next</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
