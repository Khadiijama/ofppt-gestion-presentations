import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="page-content fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
