import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import PostComposer from './PostComposer';
import FeedStream from './FeedStream';
import './FeedSurface.css';

const FeedSurface = () => {
  const { homePosts, auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showComposer, setShowComposer] = useState(false);

  const handleCreatePost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: true });
  };

  return (
    <div className="aura-feed-surface">
      <div className="aura-feed-container">
        {/* Post Composer Card */}
        <div className="aura-composer-card">
          <PostComposer onFocus={() => setShowComposer(true)} />
        </div>

        {/* Feed Stream */}
        <div className="aura-feed-stream">
          <FeedStream />
        </div>
      </div>
    </div>
  );
};

export default FeedSurface;

