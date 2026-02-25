import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyArticles, deleteArticle } from '../api';
import { selectUser } from '../store/authSlice';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
    TECH: '#6366f1', AI: '#8b5cf6', BACKEND: '#0ea5e9', FRONTEND: '#10b981',
    DEVOPS: '#f59e0b', DATABASE: '#ef4444', MOBILE: '#ec4899', SECURITY: '#f97316', OTHER: '#6b7280',
};

export default function Dashboard() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyArticles();
    }, []);

    const fetchMyArticles = async () => {
        try {
            const res = await getMyArticles();
            setArticles(res.data);
        } catch (err) {
            toast.error('Failed to load your articles.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this article permanently?')) return;
        try {
            await deleteArticle(id);
            setArticles(articles.filter(a => a.id !== id));
            toast.success('Article deleted!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete.');
        }
    };

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    }) : '';

    return (
        <div className="page-wrapper">
            <div className="dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>👤 My Dashboard</h1>
                        <p>Welcome back, <strong>{user?.username}</strong>! Manage your articles here.</p>
                    </div>
                    <Link to="/create" className="btn btn-primary">✍️ Write New Article</Link>
                </div>

                {/* Stats */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <span className="stat-number">{articles.length}</span>
                        <span className="stat-label">Total Articles</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{articles.filter(a => a.published).length}</span>
                        <span className="stat-label">Published</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{[...new Set(articles.map(a => a.category))].length}</span>
                        <span className="stat-label">Categories</span>
                    </div>
                </div>

                {/* Articles Table */}
                {loading ? (
                    <div className="loading-grid">
                        {[1, 2, 3].map(i => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : articles.length === 0 ? (
                    <div className="empty-state">
                        <span>📝</span>
                        <p>You haven't written any articles yet.</p>
                        <Link to="/create" className="btn btn-primary">Write your first article</Link>
                    </div>
                ) : (
                    <div className="articles-table">
                        {articles.map(article => (
                            <div key={article.id} className="dashboard-article-row">
                                <div
                                    className="row-category-dot"
                                    style={{ background: CATEGORY_COLORS[article.category] || '#6b7280' }}
                                />
                                <div className="row-details">
                                    <Link to={`/articles/${article.id}`} className="row-title">
                                        {article.title}
                                    </Link>
                                    <div className="row-meta">
                                        <span className="badge" style={{ background: CATEGORY_COLORS[article.category] }}>
                                            {article.category}
                                        </span>
                                        <span>{formatDate(article.createdAt)}</span>
                                        <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                                            {article.published ? '✅ Published' : '📄 Draft'}
                                        </span>
                                    </div>
                                </div>
                                <div className="row-actions">
                                    <Link to={`/articles/${article.id}`} className="btn btn-ghost-sm">👁️ View</Link>
                                    <Link to={`/articles/${article.id}/edit`} className="btn btn-outline-sm">✏️ Edit</Link>
                                    <button onClick={() => handleDelete(article.id)} className="btn btn-danger-sm">🗑️ Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
