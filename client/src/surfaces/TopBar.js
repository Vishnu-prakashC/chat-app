/**
 * TopBar - Top navigation bar
 * Completely new header component
 */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { getDataAPI } from '../utils/fetchData';
import UserAvatar from '../profile/UserAvatar';
import NotificationBell from './NotificationBell';
import SearchSurface from './SearchSurface';
import './TopBar.css';

const TopBar = ({ title, actions }) => {
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('firstLogin');
    window.location.href = '/';
  };

  return (
    <>
      <header className="aura-topbar">
        <div className="aura-topbar-container">
          <div className="aura-topbar-left">
            <Link to="/" className="aura-topbar-logo">
              <span className="aura-topbar-logo-icon">A</span>
              <span className="aura-topbar-logo-text">Aura</span>
            </Link>
          </div>

          <div className="aura-topbar-center">
            {title && <h1 className="aura-topbar-title">{title}</h1>}
          </div>

          <div className="aura-topbar-right">
            <button
              className="aura-topbar-action"
              onClick={() => setShowSearch(true)}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>

            <NotificationBell />

            <div className="aura-topbar-profile" ref={profileMenuRef}>
              <button
                className="aura-topbar-profile-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Profile menu"
              >
                <UserAvatar src={auth.user?.avatar} size={32} />
              </button>

              {showProfileMenu && (
                <div className="aura-topbar-menu">
                  <Link
                    to={`/profile/${auth.user?._id}`}
                    className="aura-topbar-menu-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="aura-topbar-menu-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                    Settings
                  </Link>
                  <button
                    className="aura-topbar-menu-item"
                    onClick={() => {
                      dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
                      setShowProfileMenu(false);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    {theme ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <hr className="aura-topbar-menu-divider" />
                  <button
                    className="aura-topbar-menu-item aura-topbar-menu-item--danger"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSearch && (
        <SearchSurface onClose={() => setShowSearch(false)} />
      )}
    </>
  );
};

export default TopBar;

