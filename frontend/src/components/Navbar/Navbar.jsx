import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import {
  Compass, User, LogOut, Bell, LayoutDashboard,
  Map, Calendar, Shield, Menu, X, ChevronDown
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <img src="/favicon.svg" alt="TravelHub" className="brand-icon" />
          <span className="brand-text">TravelHub</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/listings" className={`nav-link ${isActive('/listings') ? 'active' : ''}`}>
            <Map size={16} /> Explore
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/planner" className={`nav-link ${isActive('/planner') ? 'active' : ''}`}>
                <Calendar size={16} /> Planner
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
              <Shield size={16} /> Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="nav-icon-btn" title="Notifications">
                <Bell size={20} />
              </Link>

              <div className="profile-dropdown" ref={profileRef}>
                <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="profile-name">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`chevron ${profileOpen ? 'open' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="dropdown-menu animate-fade-in">
                    <div className="dropdown-header">
                      <span className="dropdown-user-name">{user?.name}</span>
                      <span className="dropdown-user-email">{user?.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard" className="dropdown-item">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      <User size={16} /> Profile
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
