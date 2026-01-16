import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ConversationBubble from './ConversationBubble';
import MessageComposer from './MessageComposer';
import ConversationHeader from './ConversationHeader';
import { getMessages, addMessage } from '../redux/actions/messageAction';
import './ConversationView.css';

/**
 * ConversationView - Asymmetric messaging UI
 * Completely new architecture - NOT like WhatsApp/Discord/Telegram
 */
const ConversationView = () => {
  const { id } = useParams();
  const { auth, message, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [showReactions, setShowReactions] = useState(null);

  useEffect(() => {
    if (id && auth.token) {
      dispatch(getMessages({ auth, id }));
    }
  }, [id, auth, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('addMessage', (data) => {
        if (data.conversation === id) {
          dispatch(addMessage({ ...data, auth }));
        }
      });
      return () => socket.off('addMessage');
    }
  }, [socket, id, auth, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message.data]);

  if (!id) {
    return (
      <div className="aura-conversation-empty">
        <div className="aura-empty-state">
          <div className="aura-empty-icon">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              <rect width="96" height="96" rx="24" fill="url(#emptyGradient)"/>
              <path d="M32 48L42 58L64 36" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="emptyGradient" x1="0" y1="0" x2="96" y2="96">
                  <stop stopColor="#ff6b6b"/>
                  <stop offset="1" stopColor="#4dabf7"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>Select a conversation</h2>
          <p>Choose someone from your contacts to start messaging</p>
        </div>
      </div>
    );
  }

  const currentConversation = message.data.find(c => c._id === id);
  const messages = currentConversation?.messages || [];

  return (
    <div className="aura-conversation-view">
      <ConversationHeader conversationId={id} />
      
      <div className="aura-conversation-messages">
        {messages.length === 0 ? (
          <div className="aura-conversation-start">
            <div className="aura-start-hint">
              <p>Start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="aura-messages-list">
            {messages.map((msg, index) => {
              const isOwn = msg.sender._id === auth.user._id;
              const showAvatar = index === 0 || 
                messages[index - 1].sender._id !== msg.sender._id;
              
              return (
                <ConversationBubble
                  key={msg._id}
                  message={msg}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  showReactions={showReactions === msg._id}
                  onReactionToggle={() => setShowReactions(
                    showReactions === msg._id ? null : msg._id
                  )}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageComposer conversationId={id} />
    </div>
  );
};

export default ConversationView;

