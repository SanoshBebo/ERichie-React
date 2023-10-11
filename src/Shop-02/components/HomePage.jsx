import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';

import './HomePage.css';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            <div className='headershop15'>
                <Header onSearchChange={handleSearchChange} />

                <div className="slideshow-container">
                    <img className="slideshow-image" src="/path/to/image1.jpg" alt="Image 1" />
                    <img className="slideshow-image" src="/path/to/image2.jpg" alt="Image 2" />
                    <img className="slideshow-image" src="/path/to/image3.jpg" alt="Image 3" />
                </div>

                <div className="about-us">
                    <h2>About Us</h2>

                    <p>Welcome to Sanjay Computers- your go-to destination for all things shopping. We are a passionate team of individuals dedicated to providing you with a seamless online shopping experience.</p>

                    <p>Our journey began with a simple idea: to make quality products easily accessible to people around the world. We've worked tirelessly to curate a collection of products that cater to your diverse needs and interests.</p>

                    <p>At Sanjay Computers, we believe in the power of choice and convenience. That's why we offer a wide range of products, from the latest fashion trends to cutting-edge electronics, and everything in between. We're constantly expanding our product catalog to ensure you find what you're looking for.</p>

                    <p>Our commitment to quality and customer satisfaction is unwavering. We source products from reputable suppliers and conduct rigorous quality checks to ensure you receive only the best. Our dedicated customer support team is here to assist you at every step of your shopping journey.</p>

                    <p>We understand that online shopping can be a personal experience, and we value the trust you place in us. Your satisfaction is our top priority, and we continually strive to improve and enhance your shopping experience with us.</p>

                    <p>Thank you for choosing Sanjay Computers. We look forward to being your trusted shopping destination, and we're excited to serve you for years to come.</p>
                </div>

                <div className="contact-us">
                    <h2>Contact Us</h2>
                    <p> Mobile No:876543210</p>
                    <p><a href="mailto:sanjaymanickam07@gmail.com">Email us</a></p>

                </div>

                <Footer />
            </div>
        </>
    );
};

export default HomePage;
