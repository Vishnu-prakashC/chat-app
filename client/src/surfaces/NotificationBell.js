import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import NotifyModal from '../components/NotifyModal';
import './NotificationBell.css';

const NotificationBell = ({ count }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="aura-notification-bell">
      <button
        className="aura-bell-trigger"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {count > 0 && (
          <span className="aura-bell-badge">{count > 99 ? '99+' : count}</span>
        )}
      </button>

      {showNotifications && (
        <div className="aura-notification-panel">
          <NotifyModal />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

