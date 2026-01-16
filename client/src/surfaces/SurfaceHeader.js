import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import UserAvatar from '../profile/UserAvatar';
import NotificationBell from './NotificationBell';
import SearchSurface from './SearchSurface';
import './SurfaceHeader.css';

const SurfaceHeader = ({ title, actions }) => {
  const { auth, notify, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notify.data?.filter(item => !item.isRead).length || 0;

  return (
    <header className="aura-surface-header">
      <div className="aura-surface-header-container">
        {/* Left: Logo/Brand */}
        <Link to="/" className="aura-header-brand">
          <div className="aura-brand-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="url(#brandGradient)"/>
              <path d="M14 8L18 14L14 20L10 14L14 8Z" fill="white" opacity="0.95"/>
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#FF6B6B"/>
                  <stop offset="1" stopColor="#FFB84D"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {title && <h1 className="aura-header-title">{title}</h1>}
        </Link>

        {/* Center: Search */}
        <div className="aura-header-center">
          <button
            className="aura-search-trigger"
            onClick={() => setShowSearch(true)}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span>Search creators, posts...</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="aura-header-actions">
          {actions}
          
          <NotificationBell count={unreadCount} />
          
          <div className="aura-header-profile" ref={profileMenuRef}>
            <button
              className="aura-profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Profile menu"
            >
              <UserAvatar 
                src={auth.user?.avatar} 
                size="small"
                username={auth.user?.username}
              />
            </button>
            
            {showProfileMenu && (
              <div className="aura-profile-menu">
                <div className="aura-profile-menu-header">
                  <UserAvatar 
                    src={auth.user?.avatar} 
                    size="medium"
                    username={auth.user?.username}
                  />
                  <div className="aura-profile-menu-info">
                    <div className="aura-profile-menu-name">
                      {auth.user?.fullname || auth.user?.username}
                    </div>
                    <div className="aura-profile-menu-handle">
                      @{auth.user?.username}
                    </div>
                  </div>
                </div>
                
                <div className="aura-profile-menu-divider"></div>
                
                <Link 
                  to={`/profile/${auth.user?._id}`}
                  className="aura-profile-menu-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>View Profile</span>
                </Link>
                
                <Link 
                  to="/settings"
                  className="aura-profile-menu-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m16.364 6.364l-4.243-4.243m-4.242 0L6.636 17.364m10.728-10.728L17.364 6.636M6.636 17.364l-4.243 4.243"></path>
                  </svg>
                  <span>Settings</span>
                </Link>
                
                <div className="aura-profile-menu-divider"></div>
                
                <button
                  className="aura-profile-menu-item"
                  onClick={() => {
                    dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
                    setShowProfileMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {theme ? (
                      <>
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </>
                    ) : (
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    )}
                  </svg>
                  <span>{theme ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showSearch && (
        <SearchSurface onClose={() => setShowSearch(false)} />
      )}
    </header>
  );
};

export default SurfaceHeader;

