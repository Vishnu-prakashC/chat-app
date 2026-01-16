import React from 'react';
import { useSelector } from 'react-redux';
import UserAvatar from '../profile/UserAvatar';
import './ConversationHeader.css';

const ConversationHeader = ({ conversationId }) => {
  const { message, auth } = useSelector((state) => state);
  const conversation = message.data.find(c => c._id === conversationId);
  
  if (!conversation) return null;

  const recipient = conversation.recipients.find(u => u._id !== auth.user._id);

  return (
    <header className="aura-conversation-header">
      <div className="aura-conversation-header-content">
        <UserAvatar user={recipient} size={40} />
        <div className="aura-conversation-info">
          <h3>{recipient?.username}</h3>
          <span className="aura-conversation-status">Active now</span>
        </div>
      </div>
    </header>
  );
};

export default ConversationHeader;

