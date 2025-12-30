import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import Posts from "../components/home/Posts";
import Status from "../components/home/Status";
import StoryBar from "../components/story/StoryBar";
import RightSidebar from "../components/layout/RightSidebar";
import { GLOBALTYPES } from "../redux/actions/globalTypes";

import LoadIcon from "../images/loading.gif";
import '../styles/nexus-home.css';

const Home = () => {
  const { homePosts, auth } = useSelector((state) => state);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [showStatus, setShowStatus] = useState(true);

  const handleCloseStatus = () => {
    setShowStatus(false);
  };

  const handleFabClick = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: true });
  };

  const mobileNavItems = [
    { label: t('nav.home'), icon: 'fas fa-home', path: '/' },
    { label: t('nav.messages'), icon: 'fas fa-envelope', path: '/message' },
    { label: t('nav.profile'), icon: 'fas fa-user', path: `/profile/${auth.user?._id}` },
  ];

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="nexus-home-container">
      <div className="nexus-home-layout">
        {/* Main Feed */}
        <main className="nexus-main-feed">
          {/* Stories Section */}
          <section className="nexus-stories-section">
            <div className="nexus-stories-header">
              <h2 className="nexus-section-title">Stories</h2>
              <button
                className="nexus-icon-button"
                onClick={() => dispatch({ type: GLOBALTYPES.STORY, payload: true })}
                aria-label="Create story"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <StoryBar />
          </section>

          {/* Post Creation Section */}
          {showStatus && (
            <section className="nexus-post-composer-section">
              <Status onClose={handleCloseStatus} />
            </section>
          )}

          {/* Posts Feed */}
          {homePosts.loading ? (
            <div className="nexus-loading-state">
              <div className="nexus-loading-spinner">
                <img src={LoadIcon} alt="Loading" />
                <p>{t('home.loadingText')}</p>
              </div>
            </div>
          ) : homePosts.result === 0 ? (
            <div className="nexus-empty-state">
              <div className="nexus-empty-icon">✨</div>
              <h3 className="nexus-empty-title">{t('home.emptyTitle')}</h3>
              <p className="nexus-empty-subtitle">{t('home.emptySubtitle')}</p>
            </div>
          ) : (
            <Posts />
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="nexus-sidebar">
          <RightSidebar />
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="nexus-mobile-nav">
        {mobileNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nexus-mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Floating Action Button */}
      <button 
        className="nexus-fab" 
        onClick={handleFabClick} 
        aria-label={t('home.createPost')}
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default Home;