import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectIsAuthenticated, selectUser } from '../store/authSlice';
import { logout } from '../api';
import toast from 'react-hot-toast';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (_) { }
        dispatch(clearCredentials());
        navigate('/');
        toast.success('Logged out successfully');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">📚</span>
                    <span>KnowHub</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/create" className="nav-link">✍️ New Article</Link>
                            <Link to="/dashboard" className="nav-link">My Articles</Link>
                        </>
                    )}
                </div>
                <div className="navbar-auth">
                    {isAuthenticated ? (
                        <div className="auth-user">
                            <span className="user-chip">👤 {user?.username}</span>
                            <button onClick={handleLogout} className="btn btn-outline-sm">Logout</button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline-sm">Login</Link>
                            <Link to="/signup" className="btn btn-primary-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
