import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ src, size = 'medium', username, className = '' }) => {
  const sizeClasses = {
    small: 'aura-avatar-small',
    medium: 'aura-avatar-medium',
    large: 'aura-avatar-large'
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className={`aura-avatar ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img src={src} alt={username || 'User'} />
      ) : (
        <div className="aura-avatar-placeholder">
          {getInitials(username)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

