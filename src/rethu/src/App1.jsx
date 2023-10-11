import React from 'react';
import UserPage from './components/UserPage';
import AddProduct from './components/AdminPage';



function App1() {
  const pathname = window.location.pathname;

  // Render UserPage for the root URL ("/") and AdminPage for "/admin"
  if (pathname === '/rethu/') {
    return <UserPage />;
  } else if (pathname === '/rethu/admin') {
    return <AddProduct />;
  }else if(pathname === '/rethu/') {
    return <UserPage />;
  }

  // Handle other routes or 404
  return (
    <div>
      <h1>Page Not Found</h1>
      {/* You can add a custom 404 component or message here */}
    </div>
  );
}

export default App1;
