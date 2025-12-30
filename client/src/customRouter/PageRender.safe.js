/**
 * SAFE PageRender Implementation
 * 
 * This is a production-safe version that uses static imports instead of dynamic require().
 * Replace the current PageRender.js with this implementation to avoid build issues.
 * 
 * IMPORTANT: This file is a template. You need to:
 * 1. Import all your page components at the top
 * 2. Map route names to components
 * 3. Replace the current PageRender.js with this implementation
 */

import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "../components/NotFound";

// Static imports for all pages
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Admin from "../pages/admin";
import AdminDashboard from "../pages/adminDashboard";
import Discover from "../pages/discover";
import Forgot from "../pages/forgot";
import Settings from "../pages/settings";
import Message from "../pages/message";
import MessageId from "../pages/message/[id]";
import ProfileId from "../pages/profile/[id]";
import PostId from "../pages/post/[id]";
import GroupId from "../pages/group/[id]";

// Page mapping for routes without IDs
const pageMap = {
  'home': Home,
  'login': Login,
  'register': Register,
  'admin': Admin,
  'adminDashboard': AdminDashboard,
  'discover': Discover,
  'forgot': Forgot,
  'settings': Settings,
  'message': Message,
};

// Page mapping for routes with IDs
const pageWithIdMap = {
  'message': MessageId,
  'profile': ProfileId,
  'post': PostId,
  'group': GroupId,
};

const PageRender = () => {
  const { page, id } = useParams();
  const { auth } = useSelector((state) => state);

  if (!auth.token) {
    return <NotFound />;
  }

  let PageComponent = null;

  if (id) {
    // Route with ID: /page/:id
    PageComponent = pageWithIdMap[page] || NotFound;
  } else {
    // Route without ID: /page
    PageComponent = pageMap[page] || NotFound;
  }

  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    }>
      <PageComponent />
    </Suspense>
  );
};

export default PageRender;

