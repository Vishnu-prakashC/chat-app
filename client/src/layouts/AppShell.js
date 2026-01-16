import React from 'react';
import { useSelector } from 'react-redux';
import DockNavigation from '../navigation/DockNavigation';
import SurfaceHeader from '../surfaces/SurfaceHeader';
import './AppShell.css';

/**
 * AppShell - Main layout container
 * Completely new architecture - no similarity to old Header/Sidebar
 */
const AppShell = ({ children, title, showHeader = true }) => {
  const { auth } = useSelector((state) => state);

  if (!auth.token) {
    return <>{children}</>;
  }

  return (
    <div className="aura-app-shell">
      {showHeader && <SurfaceHeader title={title} />}
      <main className="aura-main-content">
        {children}
      </main>
      <DockNavigation />
    </div>
  );
};

export default AppShell;
