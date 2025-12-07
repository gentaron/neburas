import React, { useState } from 'react';
import wikiData from '../data/wiki.json';

const Wiki = () => {
    const [activeTab, setActiveTab] = useState('characters');

    const tabs = [
        { id: 'characters', label: 'Characters 👤' },
        { id: 'world', label: 'World 🌍' },
        { id: 'terms', label: 'Terms 📖' },
        { id: 'rankings', label: 'Rankings 📊' }
    ];

    const renderList = (items) => (
        <div className="wiki-list">
            {items.map((item, index) => (
                <div key={index} className="wiki-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    );

    const renderRankingTable = (title, data) => (
        <div className="ranking-section">
            <h4>{title}</h4>
            <table className="ranking-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td className={`rank-${row.rank}`}>{row.rank}</td>
                            <td>{row.name}</td>
                            <td>{row.detail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'characters':
                return renderList(wikiData.characters);
            case 'world':
                return renderList(wikiData.world);
            case 'terms':
                return renderList(wikiData.terms);
            case 'rankings':
                return (
                    <div className="wiki-rankings">
                        {renderRankingTable('💪 Battle Strength', wikiData.rankings.strength)}
                        {renderRankingTable('🌐 Political Influence', wikiData.rankings.influence)}
                        {renderRankingTable('📈 Human Development Index (HDI)', wikiData.rankings.hdi)}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="wiki-container">
            <h2 className="wiki-title">NEBURA Encyclopedia</h2>
            <div className="wiki-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`wiki-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="wiki-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Wiki;
