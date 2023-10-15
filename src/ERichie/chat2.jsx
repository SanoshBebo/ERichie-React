import React, { useState, useEffect } from "react";

import axios from "axios";

import "./chat2.css"; // Import your CSS file
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [minimized, setMinimized] = useState(false);

  const [userInput, setUserInput] = useState("");

  const [chatMessages, setChatMessages] = useState([]);

  const [chatVisible, setChatVisible] = useState(false);

  const [productData, setProductData] = useState([]);
  // Define linkToRender as a state variable

  const databaseURLs = [
    "https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products",
    // above is computer team
    "https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/shank-mobiles/databases/(default)/documents/Products",
    //shahsank link
    "https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products",
    // "https://firestore.googleapis.com/v1/projects/supreme-mart/databases/(default)/documents/Products",
    //surya link
    "https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents/Products",
    "https://firestore.googleapis.com/v1/projects/e-ritchie/databases/(default)/documents/Products",
    // //shop 08 missing

    // Add more database URLs here
  ];

  useEffect(() => {
    // Fetch data from all databases and store it in productData

    const fetchData = async () => {
      const allData = [];

      for (const databaseURL of databaseURLs) {
        const response = await axios.get(databaseURL);

        allData.push(...response.data.documents);
      }

      setProductData(allData);
    };

    fetchData();
  }, []); // The empty dependency array ensures it runs only once

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const toggleChat = () => {
    if (minimized) {
      setMinimized(false);
    } else {
      setChatVisible(!chatVisible);
    }
  };

  const LinkCheck = (product) => {
    console.log(product);

    if (product.fields.shopid.stringValue === "shop15")
      return `checkout/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop13")
      return `/shop13/shop/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop14")
      return `/shop14/products/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop16")
      return `/shop4products/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop17")
      return `/products/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop10")
      return `/shop10/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop09")
      return `/productinfo/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop11")
      return `/shop11/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop12")
      return `/shop12/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop05")
      return `/shop05/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop04")
      return `shop04/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop01")
      return `/shop01/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop07")
      return `/shop07/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop06")
      return `/shop06/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop03")
      return `/shop03/product/${product.name.split("/").pop()}`;
    else if (product.fields.shopid.stringValue === "shop02")
      return `/shop02/product/${product.name.split("/").pop()}`;
  };
  const searchProducts = () => {
    const normalizedUserInput = userInput.toLowerCase();

    const matchingProducts = productData.filter((product) => {
      const productName = product.fields.productname.stringValue.toLowerCase();

      return productName.includes(normalizedUserInput);
    });

    const messages = [...chatMessages];

    if (matchingProducts.length > 0) {
      matchingProducts.forEach((product) => {
        const linkToRender = LinkCheck(product);

        messages.push({
          role: "system",

          content1: `${product.fields.productname.stringValue} `,
          content2: `|| Price: ${
            product.fields.price.integerValue ||
            product.fields.price.stringValue
          }`,
          link: linkToRender,
        });
      });
    } else {
      messages.push({
        role: "system",

        content1: "No matching products found.",
      });
    }

    setChatMessages(messages);
  };

  const handleUserMessage = () => {
    if (userInput) {
      const messages = [...chatMessages, { role: "user", content: userInput }];

      setChatMessages(messages);

      setUserInput("");

      searchProducts();
    }
  };

  return (
    <div>
      {chatVisible || minimized ? (
        <div className={`chatbot-container ${minimized ? "minimized" : ""}`}>
          {minimized ? (
            <div
              className="chat-minimize-button"
              onClick={() => setMinimized(true)}
            >
              <span>Minimize</span>
            </div>
          ) : (
            <>
              <div
                className="chat-close-button"
                onClick={() => setChatVisible(false)}
              >
                <span>Close ❌</span>
              </div>
              <div className="chatbox">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`chat ${message.role}`}>
                    <br />
                    <a href={message.link}>
                      {" "}
                      <button className="chat-button">
                        {message.content1}
                        {message.content2}{" "}
                      </button>{" "}
                    </a>
                  </div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  className="chat-input"
                  type="text"
                  placeholder="What do you want to shop..."
                  value={userInput}
                  onChange={handleUserInput}
                />
                <div className="sendbuttonchat">
                  <button onClick={handleUserMessage}>Send</button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="floating-chat-icon" onClick={toggleChat}>
          <span className="material-symbols-rounded text-sm">
            🤖 Too Lazy To Find Products? Ask Me!!
          </span>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
