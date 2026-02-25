import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createArticle, updateArticle, getArticle, aiImprove, aiSummarize, aiSuggestTags } from '../api';
import { selectUser } from '../store/authSlice';
import toast from 'react-hot-toast';

const CATEGORIES = ['TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATABASE', 'MOBILE', 'SECURITY', 'OTHER'];

const AI_ACTIONS = [
    { key: 'rewrite', label: '✨ Rewrite Clearly', desc: 'Improve clarity and structure' },
    { key: 'grammar', label: '📝 Fix Grammar', desc: 'Correct grammar and spelling' },
    { key: 'concise', label: '✂️ Make Concise', desc: 'Shorten and tighten content' },
    { key: 'title', label: '💡 Suggest Title', desc: 'Generate a better title' },
];

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ],
};

export default function CreateEditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const isEdit = !!id;

    const [form, setForm] = useState({
        title: '', content: '', summary: '', category: 'TECH', tags: '', published: true,
    });
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiPanel, setAiPanel] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            loadArticle();
        }
    }, [id]);

    const loadArticle = async () => {
        try {
            const res = await getArticle(id);
            const a = res.data;
            if (a.author?.id !== user?.id) {
                toast.error('You are not the author of this article.');
                navigate('/dashboard');
                return;
            }
            setForm({
                title: a.title || '',
                content: a.content || '',
                summary: a.summary || '',
                category: a.category || 'TECH',
                tags: a.tags || '',
                published: a.published ?? true,
            });
        } catch {
            toast.error('Failed to load article.');
        }
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.content || form.content === '<p><br></p>') e.content = 'Content is required';
        if (!form.category) e.category = 'Category is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (isEdit) {
                await updateArticle(id, form);
                toast.success('Article updated! ✅');
            } else {
                await createArticle(form);
                toast.success('Article published! 🎉');
            }
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save article.');
        } finally {
            setLoading(false);
        }
    };

    const handleAiAction = async (action) => {
        if (!form.content || form.content === '<p><br></p>') {
            toast.error('Add some content first before using AI!');
            return;
        }
        setAiLoading(true);
        try {
            const res = await aiImprove(form.content, form.title, action);
            if (action === 'title') {
                toast.success(res.data.result, { duration: 5000, icon: '💡' });
            } else {
                setForm(prev => ({ ...prev, content: res.data.result }));
                toast.success('AI improved your content!');
            }
        } catch {
            toast.error('AI assist failed. Try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleAutoSummarize = async () => {
        if (!form.content || form.content === '<p><br></p>') {
            toast.error('Add content first!');
            return;
        }
        setAiLoading(true);
        try {
            const res = await aiSummarize(form.content, form.title);
            setForm(prev => ({ ...prev, summary: res.data.result }));
            toast.success('Summary generated! 🤖');
        } catch {
            toast.error('Failed to generate summary.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSuggestTags = async () => {
        if (!form.content) { toast.error('Add content first!'); return; }
        setAiLoading(true);
        try {
            const res = await aiSuggestTags(form.content, form.title);
            setForm(prev => ({ ...prev, tags: res.data.result }));
            toast.success('Tags suggested! 🏷️');
        } catch {
            toast.error('Failed to suggest tags.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="create-layout">
                {/* Main Editor */}
                <div className="editor-main">
                    <div className="editor-header">
                        <h1>{isEdit ? '✏️ Edit Article' : '✍️ Write New Article'}</h1>
                        <button
                            type="button"
                            className={`btn btn-ai ${aiPanel ? 'active' : ''}`}
                            onClick={() => setAiPanel(!aiPanel)}
                        >
                            🤖 {aiPanel ? 'Hide' : 'AI Assist'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="article-form">
                        {/* Title */}
                        <div className="form-group">
                            <label>Article Title *</label>
                            <input
                                type="text"
                                className={`form-input form-input-xl ${errors.title ? 'error' : ''}`}
                                placeholder="Enter a compelling title..."
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                            {errors.title && <span className="form-error">{errors.title}</span>}
                        </div>

                        {/* Category & Tags Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    className={`form-input ${errors.category ? 'error' : ''}`}
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tags <span className="label-hint">(comma-separated)</span></label>
                                <div className="tags-input-row">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="react, nodejs, api..."
                                        value={form.tags}
                                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                    />
                                    <button type="button" className="btn btn-ai-sm" onClick={handleSuggestTags} disabled={aiLoading}>
                                        🤖 Suggest
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div className="form-group">
                            <label>Content *</label>
                            <div className={`quill-wrapper ${errors.content ? 'error' : ''}`}>
                                <ReactQuill
                                    theme="snow"
                                    value={form.content}
                                    onChange={(val) => setForm({ ...form, content: val })}
                                    modules={QUILL_MODULES}
                                    placeholder="Write your article here..."
                                />
                            </div>
                            {errors.content && <span className="form-error">{errors.content}</span>}
                        </div>

                        {/* AI Summary */}
                        <div className="form-group">
                            <div className="label-row">
                                <label>Summary <span className="label-hint">(shown on article cards)</span></label>
                                <button type="button" className="btn btn-ai-sm" onClick={handleAutoSummarize} disabled={aiLoading}>
                                    🤖 Auto-generate
                                </button>
                            </div>
                            <textarea
                                className="form-input"
                                rows={3}
                                placeholder="A brief summary of your article (auto-generated by AI or written manually)..."
                                value={form.summary}
                                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <span className="spinner" /> : (isEdit ? '💾 Update Article' : '🚀 Publish Article')}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* AI Assist Panel */}
                {aiPanel && (
                    <aside className="ai-panel">
                        <h3>🤖 AI Writing Assistant</h3>
                        <p className="ai-hint">Select an action to enhance your content with AI</p>
                        <div className="ai-actions">
                            {AI_ACTIONS.map(action => (
                                <button
                                    key={action.key}
                                    className="ai-action-btn"
                                    onClick={() => handleAiAction(action.key)}
                                    disabled={aiLoading}
                                >
                                    <span className="ai-action-label">{action.label}</span>
                                    <span className="ai-action-desc">{action.desc}</span>
                                </button>
                            ))}
                        </div>
                        {aiLoading && (
                            <div className="ai-loading">
                                <span className="spinner" />
                                <span>AI is thinking...</span>
                            </div>
                        )}
                        <div className="ai-disclaimer">
                            <p>⚡ Powered by AI. Content generation may be mocked or real based on configuration.</p>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
