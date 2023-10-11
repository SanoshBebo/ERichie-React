import React, { useState } from "react";
import cartIcon from "./carticon.png";

const Navbar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const recipientEmail = "bisenchetna3@gmail.com";
  const subject = "Contact";

  const handleEmailClick = () => {
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}`;
  };

  return (
    <div className="bg-primary py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-white text-2xl font-semibold">
          E-<span className="text-primary-bright">Mobile</span>
        </a>
        <nav className="space-x-4">
          <a href="#" className="text-white hover:text-primary-bright transition duration-300">
            Home
          </a>
          <a href="#Mobile" className="text-white hover:text-primary-bright transition duration-300">
            Mobiles
          </a>
          <button
            className="text-white hover:text-primary-bright transition duration-300"
            onClick={toggleModal}
          >
            Contact
          </button>
        </nav>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md p-4 max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <button
              onClick={handleEmailClick}
              className="bg-primary text-white font-semibold px-4 py-2 rounded-lg mr-2 hover:bg-primary-bright transition duration-300"
            >
              Send Email
            </button>
            <button
              className="bg-gray-300 text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
