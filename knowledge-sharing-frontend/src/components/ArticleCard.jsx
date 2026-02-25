import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
    TECH: '#6366f1',
    AI: '#8b5cf6',
    BACKEND: '#0ea5e9',
    FRONTEND: '#10b981',
    DEVOPS: '#f59e0b',
    DATABASE: '#ef4444',
    MOBILE: '#ec4899',
    SECURITY: '#f97316',
    OTHER: '#6b7280',
};

export default function ArticleCard({ article }) {
    const bgColor = CATEGORY_COLORS[article.category] || '#6b7280';
    const summary = article.summary ||
        (article.content
            ? article.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
            : 'No summary available.');

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    return (
        <Link to={`/articles/${article.id}`} className="article-card">
            <div className="card-category-bar" style={{ background: bgColor }}>
                <span className="card-category">{article.category}</span>
            </div>
            <div className="card-body">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-summary">{summary}</p>
                <div className="card-tags">
                    {tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
                <div className="card-footer">
                    <span className="card-author">✍️ {article.author?.username}</span>
                    <span className="card-date">{formatDate(article.createdAt)}</span>
                </div>
            </div>
        </Link>
    );
}
