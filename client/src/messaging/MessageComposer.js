import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../redux/actions/messageAction';
import { imageUpload } from '../utils/imageUpload';
import './MessageComposer.css';

/**
 * MessageComposer - Modern message input
 * Completely new design - NOT like standard chat inputs
 */
const MessageComposer = ({ conversationId }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;

    setIsSending(true);
    const msg = {
      text: text.trim(),
      media,
      conversation: conversationId,
      sender: auth.user._id,
    };

    try {
      await dispatch(addMessage({ msg, auth, socket }));
      setText('');
      setMedia([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = await Promise.all(
      files.map(file => imageUpload(file))
    );
    setMedia([...media, ...uploaded]);
  };

  return (
    <div className="aura-message-composer">
      <form onSubmit={handleSubmit} className="aura-composer-form">
        {media.length > 0 && (
          <div className="aura-composer-media-preview">
            {media.map((item, idx) => (
              <div key={idx} className="aura-media-preview-item">
                <img src={item.url} alt="" />
                <button
                  type="button"
                  onClick={() => setMedia(media.filter((_, i) => i !== idx))}
                  className="aura-media-remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="aura-composer-input-wrapper">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aura-composer-attach"
            aria-label="Attach media"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="aura-composer-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <button
            type="submit"
            disabled={isSending || (!text.trim() && media.length === 0)}
            className="aura-composer-send"
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleMediaUpload}
          style={{ display: 'none' }}
        />
      </form>
    </div>
  );
};

export default MessageComposer;

