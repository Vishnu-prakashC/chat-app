import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDataAPI } from '../utils/fetchData';
import UserAvatar from '../profile/UserAvatar';
import './SearchSurface.css';

const SearchSurface = ({ onClose }) => {
  const { auth } = useSelector((state) => state);
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], posts: [] });
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getDataAPI(`search?username=${query}&limit=10`, auth.token);
        setResults(res.data || { users: [], posts: [] });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, auth.token]);

  const handleUserClick = (userId) => {
    history.push(`/profile/${userId}`);
    onClose();
  };

  const handlePostClick = (postId) => {
    history.push(`/post/${postId}`);
    onClose();
  };

  return (
    <div className="aura-search-surface" onClick={(e) => e.stopPropagation()}>
      <div className="aura-search-container">
        <div className="aura-search-header">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search creators, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="aura-search-input"
            autoFocus
          />
          <button className="aura-search-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {loading && (
          <div className="aura-search-loading">
            <div className="aura-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {!loading && query && (
          <div className="aura-search-results">
            {results.users?.length > 0 && (
              <div className="aura-search-section">
                <h3 className="aura-search-section-title">Creators</h3>
                <div className="aura-search-users">
                  {results.users.map((user) => (
                    <button
                      key={user._id}
                      className="aura-search-user-item"
                      onClick={() => handleUserClick(user._id)}
                    >
                      <UserAvatar 
                        src={user.avatar} 
                        size="medium"
                        username={user.username}
                      />
                      <div className="aura-search-user-info">
                        <div className="aura-search-user-name">
                          {user.fullname || user.username}
                        </div>
                        <div className="aura-search-user-handle">
                          @{user.username}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.posts?.length > 0 && (
              <div className="aura-search-section">
                <h3 className="aura-search-section-title">Posts</h3>
                <div className="aura-search-posts">
                  {results.posts.map((post) => (
                    <button
                      key={post._id}
                      className="aura-search-post-item"
                      onClick={() => handlePostClick(post._id)}
                    >
                      <div className="aura-search-post-content">
                        {post.content?.slice(0, 100)}
                        {post.content?.length > 100 && '...'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loading && query && results.users?.length === 0 && results.posts?.length === 0 && (
              <div className="aura-search-empty">
                <p>No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSurface;

