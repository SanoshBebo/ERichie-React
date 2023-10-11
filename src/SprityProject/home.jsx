import React, { useState, useEffect } from 'react';

function Home() {
  const brands = ['SAMSUNG', 'APPLE', 'REDMI', 'ONEPLUS', 'MI'];

  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);

  const updateBrand = () => {
    setCurrentBrandIndex((prevIndex) => (prevIndex + 1) % brands.length);
  };

  useEffect(() => {
    const intervalId = setInterval(updateBrand, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white py-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-yellow-500">LEMON'S TECH</h1>
          <nav className="space-x-4">
            <a href="#about" className="text-gray-700 hover:text-yellow-500">About Us</a>
            <a href="#contact" className="text-gray-700 hover:text-yellow-500">Contact Us</a>
            <a href="/shop10/com" className="text-gray-700 hover:text-yellow-500">Shop</a>
          </nav>
        </div>
      </header>

      <section id="about" className="py-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">About Us</h2>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="w-full lg:w-1/2 p-4 bg-white shadow-md rounded-lg">
              <p className="text-gray-700 text-lg leading-relaxed">
                At Lemon's Tech, we're passionate about technology and innovation. We're your go-to destination for all things tech, specializing in phones and cases. With an extensive range of products and a commitment to quality, we bring you the best of the tech world at unbeatable prices.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Explore our wide variety of phones, from cutting-edge smartphones to budget-friendly options. Whether you're a tech enthusiast or looking for a reliable device, we have something for everyone.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Protect your valuable tech with our stylish and durable cases. Choose from a range of designs that suit your style while keeping your devices safe and sound.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Experience the future today with Lemon's Tech. Discover the latest gadgets, stay connected, and stay ahead of the curve. Join us in our tech journey!
              </p>
            </div>
            <div className="w-full lg:w-1/2 p-4 bg-white shadow-md rounded-lg">
              <div className="p-4 bg-yellow-500 rounded-lg">
                <p className="text-white text-lg font-semibold mb-2">Brands We Deal With:</p>
                <p className="text-2xl text-white">{brands[currentBrandIndex]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">Contact Us</h2>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="w-full lg:w-1/2 p-4 bg-white shadow-md rounded-lg">
              <p className="text-gray-700 text-lg leading-relaxed">
                Contact us via email:
              </p>
              <a href="mailto:lemontech@example.com" className="text-yellow-500 text-lg font-semibold hover:underline">lemontech@example.com</a>
              <p className="text-gray-700 text-lg leading-relaxed mt-2">
                lemontech@2023
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
