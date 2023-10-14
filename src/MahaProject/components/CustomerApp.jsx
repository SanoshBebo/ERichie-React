import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import CartIcon from './CartIcon';


const CustomerApp = () => {
  const [cart, setCart] = useState([]);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [welcomeWords, setWelcomeWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isMovingDisplayFixed, setIsMovingDisplayFixed] = useState(false);

  const words = "WELCOME TO MOBILEWORLD".split(' ');

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Add a delay to show the footer after a certain time (e.g., 5 seconds)
    const footerTimeout = setTimeout(() => {
      setIsFooterVisible(true);
    }, 5000); // Adjust the delay as needed

    // Clear the timeout if the component unmounts
    return () => {
      clearTimeout(footerTimeout);
    };
  }, []);

  useEffect(() => {
    // Display each word one by one with a delay
    const wordInterval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setWelcomeWords((prevWords) => [...prevWords, words[currentWordIndex]]);
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(wordInterval); // Stop the interval after displaying all words
      }
    }, 500); // Adjust the delay between words as needed

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(wordInterval);
    };
  }, [currentWordIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const movingDisplay = document.querySelector('.moving-display');

      if (movingDisplay) {
        const rect = movingDisplay.getBoundingClientRect();
        if (rect.top <= 0) {
          setIsMovingDisplayFixed(true);
        } else {
          setIsMovingDisplayFixed(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="design">
      <div>
        <div className={`nav-container ${isMovingDisplayFixed ? 'fixed-header' : ''}`}>
          <nav>
            <ul className="flex space-x-4">
              <li onClick={() => scrollTo('home')}>Home</li>
              <li onClick={() => scrollTo('about')}>About Us</li>
              <li onClick={() => scrollTo('contact')}>Contact Me</li>
            </ul>
          </nav>
          <h2 id="home" className=" text-4xl font-bold text-center mt-8">
            {welcomeWords.map((word, index) => (
              <span key={index}>{word} </span>
            ))}
          </h2>
          <CartIcon cart={cart} setCart={setCart} />
        </div>

        {/* <div id="image-cover">
          <img src="image3.webp" alt="Image 1" className="w-full h-auto" />
        </div> */}

        <ProductList cart={cart} setCart={setCart} />
        <div id="about" className="p-8 border border-gray-300 rounded-md">
          {/* Your about us content */}
          <p>
            At Mobile World, we're not just a mobile shop; we're your one-stop destination for all things mobile. Our mission is to keep you connected, entertained, and ahead of the curve in the digital world.
          </p>
        </div>
        <div id="contact" className="p-8 border border-gray-300 rounded-md">
          {/* Your contact information */}
          <p>Mobile World </p>
          <p>📍 Address: 123 Main Street, Chennai, Tamilnadu, 60026</p>
          <p>📞 Phone: +1 (123) 456-7890</p>
          <p>📧 Email: info@mobileworldshop.com</p>
        </div>
        {isFooterVisible && (
  <footer className="fade-in text-white p-4 text-center">
    <p>"The great growling engine of change - technology." - Alvin Toffler</p>
  </footer>
)}
      </div>
    </div>
  );
};

export default CustomerApp;
