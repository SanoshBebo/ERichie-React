import React from 'react';

const Footer = () => {
  return (
    <div className='bg-black text-white py-4 text-center'>
      <p>&copy; {new Date().getFullYear()} Cosmic Media Gadgets</p>
    </div>
  );
};

export default Footer;
