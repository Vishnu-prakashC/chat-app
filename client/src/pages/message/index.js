import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'
import { useParams } from 'react-router-dom'
import '../../styles/nexus-message.css'

const Message = () => {
    const { id } = useParams();
    
    return (
      <div className="nexus-messenger">
        <div className="nexus-messenger-sidebar">
          <LeftSide />
        </div>

        <div className="nexus-messenger-main">
          {id ? (
            <RightSide />
          ) : (
            <div className="nexus-messenger-welcome">
              <div className="nexus-welcome-content">
                <div className="nexus-welcome-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="80" height="80" rx="20" fill="url(#welcomeGradient)"/>
                    <path d="M40 20L50 40L40 60L30 40L40 20Z" fill="white" opacity="0.9"/>
                    <defs>
                      <linearGradient id="welcomeGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366f1"/>
                        <stop offset="1" stopColor="#ec4899"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h2 className="nexus-welcome-title">Welcome to Nexus Chat</h2>
                <p className="nexus-welcome-subtitle">
                  Start a conversation by selecting a contact from the sidebar or search for someone new.
                </p>
                <div className="nexus-welcome-features">
                  <div className="nexus-feature-item">
                    <i className="fas fa-bolt"></i>
                    <span>Lightning fast</span>
                  </div>
                  <div className="nexus-feature-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>End-to-end secure</span>
                  </div>
                  <div className="nexus-feature-item">
                    <i className="fas fa-paper-plane"></i>
                    <span>Real-time sync</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

export default Message
