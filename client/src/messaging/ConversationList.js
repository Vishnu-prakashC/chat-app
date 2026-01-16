import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getConversations } from '../redux/actions/messageAction';
import UserAvatar from '../profile/UserAvatar';
import { format } from 'timeago.js';
import './ConversationList.css';

/**
 * ConversationList - New conversation list design
 * NOT like standard chat app sidebar
 */
const ConversationList = () => {
  const { message, auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (auth.token) {
      dispatch(getConversations(auth.token));
    }
  }, [auth.token, dispatch]);

  const conversations = message.conversations || [];

  return (
    <aside className="aura-conversation-list">
      <div className="aura-conversation-list-header">
        <h2>Conversations</h2>
      </div>

      <div className="aura-conversation-list-content">
        {conversations.length === 0 ? (
          <div className="aura-conversation-empty-state">
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const recipient = conv.recipients.find(u => u._id !== auth.user._id);
            const lastMessage = conv.messages?.[conv.messages.length - 1];
            const isActive = pathname.includes(conv._id);

            return (
              <Link
                key={conv._id}
                to={`/message/${conv._id}`}
                className={`aura-conversation-item ${isActive ? 'active' : ''}`}
              >
                <UserAvatar user={recipient} size={48} />
                <div className="aura-conversation-item-content">
                  <div className="aura-conversation-item-header">
                    <h3>{recipient?.username}</h3>
                    {lastMessage && (
                      <span className="aura-conversation-time">
                        {format(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="aura-conversation-preview">
                      {lastMessage.text?.slice(0, 50)}
                      {lastMessage.text?.length > 50 && '...'}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ConversationList;

