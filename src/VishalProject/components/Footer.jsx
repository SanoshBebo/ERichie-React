import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'pink', // Change 'red' to the color you desire
    color: 'black',
    padding: '1rem', // You can adjust the padding as needed
    textAlign: 'center',
  };

  return (
    <div style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Vishal Media Shop</p>
    </div>
  );
};

export default Footer;
