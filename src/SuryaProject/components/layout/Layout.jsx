import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="content" style={{ flex: '1' }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
