import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import UserAvatar from '../profile/UserAvatar';
import './PostComposer.css';

const PostComposer = ({ onFocus }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: true });
    if (onFocus) onFocus();
  };

  return (
    <div className="aura-post-composer">
      <div className="aura-composer-header">
        <UserAvatar 
          src={auth.user?.avatar} 
          size="small"
          username={auth.user?.username}
        />
        <button 
          className="aura-composer-input"
          onClick={handleClick}
        >
          <span className="aura-composer-placeholder">
            Share what's on your mind...
          </span>
        </button>
      </div>
      
      <div className="aura-composer-actions">
        <button 
          className="aura-composer-action"
          onClick={() => dispatch({ type: GLOBALTYPES.STORY, payload: true })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span>Photo</span>
        </button>
        
        <button 
          className="aura-composer-action"
          onClick={handleClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Write</span>
        </button>
      </div>
    </div>
  );
};

export default PostComposer;

