import React from 'react';
import './ReactionPicker.css';

const ReactionPicker = ({ messageId, onClose }) => {
  const reactions = ['❤️', '👍', '😄', '😮', '😢', '🔥'];

  return (
    <div className="aura-reaction-picker">
      {reactions.map((emoji) => (
        <button
          key={emoji}
          className="aura-reaction-option"
          onClick={() => {
            // Handle reaction
            onClose();
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;

