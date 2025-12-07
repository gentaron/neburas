import { useState, useEffect } from 'react'
import novelData from './data/novel.json'
import Wiki from './components/Wiki'

function App() {
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
    const [theme, setTheme] = useState('dark') // 'light', 'dark', 'sepia'
    const [view, setView] = useState('novel') // 'novel' or 'wiki'

    const currentChapter = novelData[currentChapterIndex]

    // Update body class for global theme styles
    useEffect(() => {
        document.body.className = `theme-${theme}`
    }, [theme])

    const handleNext = () => {
        if (currentChapterIndex < novelData.length - 1) {
            window.scrollTo(0, 0)
            setCurrentChapterIndex(curr => curr + 1)
        }
    }

    const handlePrev = () => {
        if (currentChapterIndex > 0) {
            window.scrollTo(0, 0)
            setCurrentChapterIndex(curr => curr - 1)
        }
    }

    const toggleTheme = () => {
        const themes = ['light', 'sepia', 'dark']
        const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length]
        setTheme(nextTheme)
    }

    return (
        <div className="app-container">
            <nav className="navbar">
                <h1 className="nav-title">NEBURA <span className="nav-subtitle">Web Novel</span></h1>
                <div className="nav-controls">
                    <button className="theme-btn" onClick={toggleTheme}>
                        {theme === 'light' ? '🌞' : theme === 'sepia' ? '📜' : '🌙'}
                    </button>
                </div>
            </nav>

            <div className="navigation-bar">
                <button
                    className={`nav-btn ${view === 'novel' ? 'active' : ''}`}
                    onClick={() => setView('novel')}
                >
                    📖 Read Novel
                </button>
                <button
                    className={`nav-btn ${view === 'wiki' ? 'active' : ''}`}
                    onClick={() => setView('wiki')}
                >
                    📚 Wiki / Data
                </button>
            </div>

            {view === 'wiki' ? (
                <Wiki />
            ) : (
                <main className="reader-container">
                    <div className="chapter-card">
                        <h2 className="chapter-title">{currentChapter.title}</h2>
                        <div className="chapter-content">
                            {currentChapter.content.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="chapter-controls">
                            <button
                                className="control-btn"
                                onClick={handlePrev}
                                disabled={currentChapterIndex === 0}
                            >
                                ← Prev
                            </button>
                            <span className="chapter-indicator">
                                {currentChapterIndex + 1} / {novelData.length}
                            </span>
                            <button
                                className="control-btn"
                                onClick={handleNext}
                                disabled={currentChapterIndex === novelData.length - 1}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </main>
            )}
        </div>
    )
}

export default App
