// App.js
import React from 'react';


import ShoppingPage from './pages/ShoppingPage';
import ProductDescriptionPage from './pages/ProductDescription';

function App() {
  const pathname = window.location.pathname;

  // Render UserPage for the root URL ("/") and AdminPage for "/admin"
  if (pathname === '/thillai/') {
    return < ShoppingPage/>;
  } else if (pathname === '/product/:productId') {
    return <ProductDescriptionPage />;
  }else if(pathname === '/thillai') {
    return < ShoppingPage/>;
  }
  return (
    <div>
    <h1>Page Not Found</h1>
    {/* You can add a custom 404 component or message here */}
  </div>
  );
}

export default App;
