import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from '../../redux/actions/postAction';
import { getSuggestions } from '../../redux/actions/suggestionsAction';
import '../../styles/nexus-header.css';

const Header = () => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefreshHome = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
    dispatch(getPosts(auth.token));
    dispatch(getSuggestions(auth.token));
  };

  return (
    <header className={`nexus-header ${scrolled ? 'nexus-header-scrolled' : ''}`}>
      <div className="nexus-header-container">
        {/* Logo Section */}
        <div className="nexus-logo-section">
          <Link to="/" className="nexus-logo-link" onClick={handleRefreshHome}>
            <div className="nexus-logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                <path d="M16 8L20 16L16 24L12 16L16 8Z" fill="white" opacity="0.9"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1"/>
                    <stop offset="1" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="nexus-logo-text">Nexus</span>
          </Link>
        </div>

        {/* Search Section */}
        <div className="nexus-search-section">
          <Search />
        </div>

        {/* Navigation Section */}
        <div className="nexus-nav-section">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
