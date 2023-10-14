import React, { useState } from "react";

import axios from "axios";

import Modal from "react-modal";

// Modal.setAppElement("#app"); // Assuming your root element id is 'app'

const OperatorAdding = () => {
  const [addedProduct, setAddedProduct] = useState(null);

  const [newMobile, setNewMobile] = useState({
    category: "Mobile",

    description: "",

    price: "",

    productname: "",

    shopid: "shop11",

    stock: "",

    imageurl: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const addMobile = () => {
    if (
      !newMobile.productname ||
      !newMobile.description ||
      !newMobile.price ||
      !newMobile.stock ||
      !newMobile.imageurl
    ) {
      alert("All fields are mandatory.");

      return;
    }

    const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products`;

    // Perform the API request using Axios

    axios

      .post(apiUrl, {
        fields: {
          category: { stringValue: newMobile.category },

          description: { stringValue: newMobile.description },

          price: { integerValue: newMobile.price },

          productname: { stringValue: newMobile.productname },

          shopid: { stringValue: newMobile.shopid },

          stock: { integerValue: newMobile.stock },

          imageurl: { stringValue: newMobile.imageurl },
        },
      })

      .then((response) => {
        console.log("Mobile phone added successfully:", response.data);

        // Clear the form after successful submission

        setNewMobile({
          category: "Mobile",

          description: "",

          price: "",

          productname: "",

          shopid: "shop11",

          stock: "",

          imageurl: "",
        });

        // Show success message for 3 seconds (3000 milliseconds)

        setSuccessMessage("Product added successfully");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        // Open the modal after successful submission

        setIsModalOpen(true);
      })

      .catch((error) => {
        console.error("Error adding mobile phone:", error);
      });
  };

  const inputStyle = {
    width: "100%",

    padding: "10px",

    margin: "10px 0",

    borderRadius: "5px",

    border: "1px solid #ccc",

    fontSize: "16px",

    outline: "none",
  };

  return (
    <div
      className="add-container"
      style={{ textAlign: "center", marginTop: "20px" }}
    >
      <div className="heading">
        <h1 style={{ color: "red", fontSize: "24px", textAlign: "center" }}>
          Add Product Details
        </h1>

        <div
          className="inputfield-container"
          style={{ maxWidth: "300px", margin: "0 auto" }}
        >
          <input
            type="text"
            placeholder="Product Name"
            value={newMobile.productname}
            onChange={(e) =>
              setNewMobile({ ...newMobile, productname: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Description"
            value={newMobile.description}
            onChange={(e) =>
              setNewMobile({ ...newMobile, description: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Price"
            min="1"
            value={newMobile.price}
            onChange={(e) =>
              setNewMobile({ ...newMobile, price: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Stock"
            min="1"
            value={newMobile.stock}
            onChange={(e) =>
              setNewMobile({ ...newMobile, stock: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newMobile.imageurl}
            onChange={(e) =>
              setNewMobile({ ...newMobile, imageurl: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div className="addbtn" style={{ marginTop: "20px" }}>
          <button
            onClick={addMobile}
            style={{
              backgroundColor: "#007bff",

              color: "white",

              padding: "10px 20px",

              border: "none",

              borderRadius: "5px",

              fontSize: "16px",

              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Product Added Modal"
        className="modal-content"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Background overlay color
          },

          content: {
            width: "300px", // Modal content width

            margin: "0 auto", // Center the modal

            borderRadius: "5px", // Modal border radius

            padding: "20px", // Modal padding
          },
        }}
      >
        {addedProduct && (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
              Product Added Successfully
            </h2>

            <h3>{addedProduct.productname}</h3>

            <p>Description: {addedProduct.description}</p>

            <p>Price: ${addedProduct.price}</p>

            <p>Stock: {addedProduct.stock}</p>

            <img
              src={addedProduct.imageurl}
              alt={addedProduct.productname}
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(false)}
          style={{
            backgroundColor: "#007bff", // Button background color

            color: "white", // Button text color

            padding: "10px 20px", // Button padding

            border: "none", // Remove button border

            borderRadius: "5px", // Button border radius

            fontSize: "16px", // Button font size

            cursor: "pointer", // Show pointer cursor on hover

            marginTop: "10px", // Add margin to the top of the button
          }}
        >
          Close
        </button>
      </Modal>

      {successMessage && (
        <div
          style={{
            backgroundColor: "#28a745", // Background color

            color: "white", // Text color

            padding: "10px", // Padding

            borderRadius: "5px", // Border radius

            marginTop: "10px", // Margin from the top
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default OperatorAdding;
