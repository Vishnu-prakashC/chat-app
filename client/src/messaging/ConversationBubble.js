import React, { useState } from 'react';
import { format } from 'timeago.js';
import UserAvatar from '../profile/UserAvatar';
import ReactionPicker from './ReactionPicker';
import './ConversationBubble.css';

/**
 * ConversationBubble - Asymmetric message bubbles
 * NOT like standard chat apps - unique layout
 */
const ConversationBubble = ({ message, isOwn, showAvatar, showReactions, onReactionToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`aura-bubble-container ${isOwn ? 'own' : 'other'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isOwn && showAvatar && (
        <div className="aura-bubble-avatar">
          <UserAvatar user={message.sender} size={32} />
        </div>
      )}

      <div className="aura-bubble-content">
        {!isOwn && (
          <div className="aura-bubble-sender">
            {message.sender.username}
          </div>
        )}

        <div className={`aura-bubble ${isOwn ? 'own' : 'other'}`}>
          {message.text && (
            <div className="aura-bubble-text">
              {message.text}
            </div>
          )}

          {message.media && message.media.length > 0 && (
            <div className="aura-bubble-media">
              {message.media.map((item, idx) => (
                <div key={idx} className="aura-media-item">
                  {item.url.match(/video/i) ? (
                    <video src={item.url} controls />
                  ) : (
                    <img src={item.url} alt="" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="aura-bubble-footer">
            <span className="aura-bubble-time">
              {format(message.createdAt)}
            </span>
            {message.isRead && isOwn && (
              <span className="aura-bubble-read">✓✓</span>
            )}
          </div>
        </div>

        {isHovered && (
          <button
            className="aura-bubble-reaction-btn"
            onClick={onReactionToggle}
            aria-label="Add reaction"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
              <path d="M8 6v4M6 8h4" />
            </svg>
          </button>
        )}

        {showReactions && (
          <ReactionPicker
            messageId={message._id}
            onClose={() => onReactionToggle()}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationBubble;

