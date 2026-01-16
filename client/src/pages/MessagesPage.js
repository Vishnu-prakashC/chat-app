import React from 'react';
import AppShell from '../layouts/AppShell';
import ConversationList from '../messaging/ConversationList';
import ConversationView from '../messaging/ConversationView';
import { useParams } from 'react-router-dom';
import './MessagesPage.css';

/**
 * MessagesPage - New messaging page architecture
 * Split view: conversations list + active conversation
 */
const MessagesPage = () => {
  const { id } = useParams();

  return (
    <AppShell title="Messages">
      <div className="aura-messages-page">
        <div className="aura-messages-layout">
          <ConversationList />
          <ConversationView />
        </div>
      </div>
    </AppShell>
  );
};

export default MessagesPage;

