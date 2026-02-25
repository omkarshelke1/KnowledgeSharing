import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getArticle, deleteArticle } from '../api';
import { selectUser, selectIsAuthenticated } from '../store/authSlice';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
    TECH: '#6366f1', AI: '#8b5cf6', BACKEND: '#0ea5e9', FRONTEND: '#10b981',
    DEVOPS: '#f59e0b', DATABASE: '#ef4444', MOBILE: '#ec4899', SECURITY: '#f97316', OTHER: '#6b7280',
};

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const res = await getArticle(id);
            setArticle(res.data);
        } catch (err) {
            toast.error('Article not found.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await deleteArticle(id);
            toast.success('Article deleted!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Delete failed.');
        }
    };

    if (loading) return <div className="page-wrapper"><div className="skeleton-article" /></div>;
    if (!article) return null;

    const isAuthor = user && article.author?.id === user.id;
    const catColor = CATEGORY_COLORS[article.category] || '#6b7280';
    const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    }) : '';

    return (
        <div className="page-wrapper">
            <article className="article-detail">
                {/* Header */}
                <div className="article-header">
                    <div className="article-meta-top">
                        <span className="category-badge" style={{ background: catColor }}>
                            {article.category}
                        </span>
                        {isAuthor && (
                            <div className="author-actions">
                                <Link to={`/articles/${id}/edit`} className="btn btn-outline-sm">✏️ Edit</Link>
                                <button onClick={handleDelete} className="btn btn-danger-sm">🗑️ Delete</button>
                            </div>
                        )}
                    </div>
                    <h1 className="article-title">{article.title}</h1>
                    {article.summary && (
                        <p className="article-summary">🤖 <em>{article.summary}</em></p>
                    )}
                    <div className="article-author-info">
                        <div className="author-avatar">
                            {article.author?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="author-name">✍️ {article.author?.username}</span>
                            <div className="article-dates">
                                <span>Published: {formatDate(article.createdAt)}</span>
                                {article.updatedAt && article.updatedAt !== article.createdAt && (
                                    <span> · Updated: {formatDate(article.updatedAt)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="article-content ql-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="article-tags-section">
                        <h4>🏷️ Tags</h4>
                        <div className="tags-list">
                            {tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="article-back">
                    <Link to="/" className="btn btn-outline">← Back to Articles</Link>
                </div>
            </article>
        </div>
    );
}
