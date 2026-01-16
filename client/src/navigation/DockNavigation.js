import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './DockNavigation.css';

/**
 * DockNavigation - Bottom dock navigation
 * Completely new paradigm - NOT a sidebar
 */
const DockNavigation = () => {
  const { pathname } = useLocation();
  const { auth } = useSelector((state) => state);

  if (!auth.token) return null;

  const navItems = [
    { path: '/', icon: 'home', label: 'Feed' },
    { path: '/explore', icon: 'compass', label: 'Explore' },
    { path: '/message', icon: 'message-circle', label: 'Messages' },
    { path: '/profile', icon: 'user', label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="aura-dock">
      <div className="aura-dock-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`aura-dock-item ${isActive(item.path) ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="aura-dock-icon">
              {item.icon === 'home' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              )}
              {item.icon === 'compass' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              )}
              {item.icon === 'message-circle' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              )}
              {item.icon === 'user' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <span className="aura-dock-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DockNavigation;
