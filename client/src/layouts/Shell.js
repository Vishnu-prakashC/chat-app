/**
 * Shell - Main application layout wrapper
 * Completely new layout architecture
 */
import React from 'react';
import { useSelector } from 'react-redux';
import DockNav from '../navigation/DockNav';
import TopBar from '../surfaces/TopBar';
import './Shell.css';

const Shell = ({ children, showTopBar = true, topBarTitle, topBarActions }) => {
  const { auth } = useSelector((state) => state);

  if (!auth.token) {
    return <>{children}</>;
  }

  return (
    <div className="aura-shell">
      {showTopBar && (
        <TopBar title={topBarTitle} actions={topBarActions} />
      )}
      
      <main className="aura-shell-main">
        {children}
      </main>
      
      <DockNav />
    </div>
  );
};

export default Shell;

