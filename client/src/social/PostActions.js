import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost } from '../redux/actions/postAction';
import LikeButton from '../components/LikeButton';
import Comments from '../components/home/Comments';
import InputComment from '../components/home/InputComment';
import './PostActions.css';

const PostActions = ({ post }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes?.find((like) => like._id === auth.user?._id) ? true : false
  );
  const [saved, setSaved] = useState(
    auth.user?.saved?.find(id => id === post._id) ? true : false
  );

  const handleLike = async () => {
    if (isLiked) {
      await dispatch(unLikePost({ post, auth, socket }));
      setIsLiked(false);
    } else {
      await dispatch(likePost({ post, auth, socket }));
      setIsLiked(true);
    }
  };

  const handleSave = async () => {
    if (saved) {
      await dispatch(unSavePost({ post, auth }));
      setSaved(false);
    } else {
      await dispatch(savePost({ post, auth }));
      setSaved(true);
    }
  };

  return (
    <div className="aura-post-actions">
      <div className="aura-post-actions-row">
        <button 
          className={`aura-action-button ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <LikeButton isLike={isLiked} handleLike={handleLike} handleUnLike={handleLike} />
          <span className="aura-action-count">{post.likes?.length || 0}</span>
        </button>

        <button 
          className={`aura-action-button ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments(!showComments)}
          aria-label="Comments"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="aura-action-count">{post.comments?.length || 0}</span>
        </button>

        <button 
          className={`aura-action-button ${saved ? 'active' : ''}`}
          onClick={handleSave}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={saved ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {post.likes?.length > 0 && (
        <div className="aura-post-stats">
          <span className="aura-stat-text">
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </span>
        </div>
      )}

      {showComments && (
        <div className="aura-post-comments-section">
          <Comments post={post} />
          <InputComment post={post} />
        </div>
      )}
    </div>
  );
};

export default PostActions;

