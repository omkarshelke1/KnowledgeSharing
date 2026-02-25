import React, { useState, useEffect } from 'react';
import { getArticles, searchArticles } from '../api';
import ArticleCard from '../components/ArticleCard';

const CATEGORIES = ['ALL', 'TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATABASE', 'MOBILE', 'SECURITY', 'OTHER'];

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const res = await getArticles();
            setArticles(res.data);
        } catch (err) {
            setError('Failed to load articles.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const category = selectedCategory === 'ALL' ? '' : selectedCategory;
            const res = await searchArticles(search, category);
            setArticles(res.data);
        } catch (err) {
            setError('Search failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = async (cat) => {
        setSelectedCategory(cat);
        try {
            setLoading(true);
            const category = cat === 'ALL' ? '' : cat;
            const res = await searchArticles(search, category);
            setArticles(res.data);
        } catch (_) { } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setSearch('');
        setSelectedCategory('ALL');
        await fetchArticles();
    };

    return (
        <div className="page-wrapper">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="gradient-text">Share Knowledge,</span><br />
                        Empower Developers
                    </h1>
                    <p className="hero-subtitle">
                        Discover technical articles, tutorials, and insights from the community.<br />
                        AI-powered writing assistance built right in.
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="search-section">
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title, content, or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                    {(search || selectedCategory !== 'ALL') && (
                        <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>
                    )}
                </form>
                <div className="category-filters">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Articles Grid */}
            <section className="articles-section">
                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : error ? (
                    <div className="error-msg">{error}</div>
                ) : articles.length === 0 ? (
                    <div className="empty-state">
                        <span>📭</span>
                        <p>No articles found. Be the first to write one!</p>
                    </div>
                ) : (
                    <div className="articles-grid">
                        {articles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
