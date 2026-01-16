import React from 'react';
import { useSelector } from 'react-redux';
import PostCard from './PostCard';
import LoadIcon from '../images/loading.gif';
import './FeedStream.css';

const FeedStream = () => {
  const { homePosts } = useSelector((state) => state);

  if (homePosts.loading) {
    return (
      <div className="aura-feed-loading">
        <img src={LoadIcon} alt="Loading" />
        <p>Loading your feed...</p>
      </div>
    );
  }

  if (homePosts.result === 0) {
    return (
      <div className="aura-feed-empty">
        <div className="aura-empty-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" opacity="0.3"/>
            <path d="M40 60L55 75L80 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          </svg>
        </div>
        <h3>Your feed is empty</h3>
        <p>Start following creators to see their posts here</p>
      </div>
    );
  }

  return (
    <div className="aura-feed-stream-list">
      {homePosts.posts.map((post, index) => (
        <PostCard 
          key={post._id} 
          post={post}
          index={index}
        />
      ))}
    </div>
  );
};

export default FeedStream;

