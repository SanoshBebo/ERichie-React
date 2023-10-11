import React from "react";

const ContactForm = () => {
  const recipientEmail = "bisenchetna3@gmail.com";
  const subject = "Contact";

  const handleEmailClick = () => {
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us</h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-300"
        onClick={handleEmailClick}
      >
        Send Email
      </button>
    </div>
  );
};

export { ContactForm };
