import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppShell from '../layouts/AppShell';
import FeedStream from '../social/FeedStream';
import FeedSurface from '../social/FeedSurface';
import { getPosts } from '../redux/actions/postAction';
import './FeedPage.css';

/**
 * FeedPage - Feed-first home page
 * Completely new architecture - social-first, not chat-first
 */
const FeedPage = () => {
  const { auth, homePosts } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.token && homePosts.posts.length === 0) {
      dispatch(getPosts(auth.token));
    }
  }, [auth.token, dispatch, homePosts.posts.length]);

  return (
    <AppShell title="Feed">
      <div className="aura-feed-page">
        <div className="aura-feed-container">
          <div className="aura-feed-main">
            <FeedSurface />
            <FeedStream />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default FeedPage;
