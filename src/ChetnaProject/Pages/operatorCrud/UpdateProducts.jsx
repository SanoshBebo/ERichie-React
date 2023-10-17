import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import Modal from "react-modal";

const UpdateProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [updatedProduct, setUpdatedProduct] = useState({
    category: "",

    description: "",

    price: null,

    productname: "",

    shopid: "",

    stock: null,

    imageurl: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage] = useState(4);

  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");

  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState(null); // Add this line for error message state

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Add this line for error modal state

  const [errorVisible, setErrorVisible] = useState(false);

  const openErrorModal = (message) => {
    setErrorMessage(message);

    setIsErrorModalOpen(true);

    setErrorVisible(true);
  };

  const closeErrorModal = () => {
    setErrorMessage("");

    setIsErrorModalOpen(false);

    setErrorVisible(false);
  };

  useEffect(() => {
    if (errorVisible) {
      // Close the error modal after 3 seconds

      const timer = setTimeout(() => {
        closeErrorModal();
      }, 3000);

      // Clear the timer when the component unmounts or when isErrorModalOpen state changes

      return () => clearTimeout(timer);
    }
  }, [errorVisible]);

  useEffect(() => {
    axios

      .get(
        "https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products"
      )

      .then((response) => {
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;

          return {
            id: doc.name.split("/").pop(),

            category: data.category.stringValue,

            description: data.description.stringValue,

            price: data.price.integerValue,

            productname: data.productname.stringValue,

            shopid: data.shopid.stringValue,

            stock: data.stock.integerValue,

            imageurl: data.imageurl.stringValue,
          };
        });

        setProducts(productsData);
      })

      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (product) => {
    setSelectedProduct(product);

    setIsModalOpen(true);

    setUpdatedProduct({
      category: product.category,

      description: product.description,

      price: product.price,

      productname: product.productname,

      shopid: product.shopid,

      stock: product.stock,

      imageurl: product.imageurl,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = async (file) => {
    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/e-mobile-81b40.appspot.com/o/${encodeURIComponent(
      "images/" + file.name
    )}`;

    try {
      await axios.post(storageUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/e-mobile-81b40.appspot.com/o/${encodeURIComponent(
        "images/" + file.name
      )}?alt=media`;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);

      return null;
    }
  };

  const handleUpdateProduct = async () => {
    if (
      !updatedProduct.productname ||
      !updatedProduct.description ||
      isNaN(updatedProduct.price) ||
      isNaN(updatedProduct.stock) ||
      updatedProduct.price <= 0 ||
      updatedProduct.stock <= 0 ||
      !updatedProduct.imageurl
    ) {
      openErrorModal(
        "All fields are mandatory, and price/stock should be a positive number."
      );

      // setTimeout(() => {

      //   openErrorModal(null);

      // }, 3000);

      return;
    }

    if (
      !selectedProduct ||
      !updatedProduct.productname ||
      !updatedProduct.description ||
      !updatedProduct.price ||
      !updatedProduct.stock
    ) {
      console.error("Invalid product data");

      return;
    }

    let imageUrl = updatedProduct.imageurl;

    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      const uploadedImageUrl = await handleImageUpload(
        fileInputRef.current.files[0]
      );

      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else {
        console.error("Error uploading image.");

        return;
      }
    }

    const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${selectedProduct.id}`;

    const updatedData = {
      fields: {
        category: { stringValue: updatedProduct.category },

        description: { stringValue: updatedProduct.description },

        price: { integerValue: updatedProduct.price },

        productname: { stringValue: updatedProduct.productname },

        shopid: { stringValue: updatedProduct.shopid },

        stock: { integerValue: updatedProduct.stock },

        imageurl: { stringValue: imageUrl },
      },
    };

    axios

      .patch(apiUrl, updatedData)

      .then((response) => {
        console.log("Product updated successfully:", response.data);

        setUpdateSuccessMessage("Product updated successfully");

        setTimeout(() => {
          setUpdateSuccessMessage("");
        }, 3000);

        setProducts((prevProducts) => {
          return prevProducts.map((product) => {
            if (product.id === selectedProduct.id) {
              return {
                ...product,

                category: updatedProduct.category,

                description: updatedProduct.description,

                price: updatedProduct.price,

                productname: updatedProduct.productname,

                shopid: updatedProduct.shopid,

                stock: updatedProduct.stock,

                imageurl: imageUrl,
              };
            }

            return product;
          });
        });

        closeModal();
      })

      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  return (
    <div
      className="update-products-container"
      style={{ textAlign: "center", marginTop: "20px" }}
    >
      <Modal
        isOpen={isErrorModalOpen}
        onRequestClose={closeErrorModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",

            zIndex: 1002,
          },

          content: {
            width: "300px",

            height: "200px",

            margin: "auto",

            backgroundColor: "#fff",

            borderRadius: "8px",

            textAlign: "center",

            padding: "20px",

            zIndex: 1001,

            left: "50%", // Center the modal horizontally

            transform: "translateX(-50%)", // Center the modal horizontally
          },
        }}
      >
        {/* Error Message */}

        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h2 style={{ color: "#ff0000" }}>Error</h2>

          <p>{errorMessage}</p>
        </div>

        <button
          onClick={closeErrorModal}
          style={{
            backgroundColor: "#ff0000",

            color: "#fff",

            padding: "10px 20px",

            border: "none",

            borderRadius: "4px",

            cursor: "pointer",
          }}
        >
          Close
        </button>
      </Modal>

      <h1 style={{ color: "red", fontSize: "24px" }}>Update Product</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",

          padding: "10px",

          border: "1px solid #007bff",

          borderRadius: "5px",

          fontSize: "16px",

          outline: "none",

          background: "#007bff",

          transition: "box-shadow 0.3s ease",

          margin: "10px",
        }}
      />

      <div
        className="update-products-container"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {currentProducts.length === 0 && searchTerm !== "" ? (
          <p>No products found.</p>
        ) : (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                border: "1px solid #ccc",

                padding: "20px",

                marginBottom: "20px",

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                width: "200px",

                margin: "10px",

                transition: "transform 0.3s ease",

                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {/* Product Details */}

              <img
                src={product.imageurl}
                alt={product.productname}
                className="product-image"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />

              <h3>{product.productname}</h3>

              <p>Category: {product.category}</p>

              <p>Price: ₹{product.price}</p>

              <p>Shop ID: {product.shopid}</p>

              <p>Stock: {product.stock}</p>

              {/* Update Button */}

              <button
                onClick={() => openModal(product)}
                className="update-btn-admin"
                style={{
                  backgroundColor: "#007bff",

                  color: "white",

                  padding: "10px 20px",

                  border: "none",

                  borderRadius: "5px",

                  cursor: "pointer",

                  marginTop: "10px",

                  transition: "background-color 0.3s ease",
                }}
              >
                Update
              </button>
            </div>
          ))
        )}
      </div>

      {/* Update Product Modal */}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Update Product Modal"
        className="modal-content"
        style={{
          overlay: {
            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },

          content: {
            width: "300px",

            height: "500px",

            overflowY: "auto",

            margin: "0 auto",

            backgroundColor: "#fff",

            padding: "20px",

            borderRadius: "8px",

            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

            textAlign: "center",
          },
        }}
      >
        {/* Update Product Form */}

        {selectedProduct && (
          <div>
            <h2 style={{ margin: "10px 0" }}>Update Product</h2>

            {/* Product Name */}

            <label style={{ margin: "10px 0", display: "block" }}>
              Product Name:
            </label>

            <input
              type="text"
              value={updatedProduct.productname}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  productname: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            {/* Category */}

            <label style={{ margin: "10px 0", display: "block" }}>
              Category:
            </label>

            <input
              type="text"
              value={updatedProduct.category}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  category: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            {/* Description */}

            <label style={{ margin: "10px 0", display: "block" }}>
              Description:
            </label>

            <input
              type="text"
              value={updatedProduct.description}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  description: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            {/* Price */}

            <label style={{ margin: "10px 0", display: "block" }}>Price:</label>

            <input
              type="number"
              min="0"
              value={updatedProduct.price}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, price: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            {/* Stock */}

            <label style={{ margin: "10px 0", display: "block" }}>Stock:</label>

            <input
              type="number"
              min="0"
              value={updatedProduct.stock}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, stock: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            {/* Image URL */}

            <label style={{ margin: "10px 0", display: "block" }}>
              Image URL:
            </label>

            <input
              type="text"
              value={updatedProduct.imageurl}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  imageurl: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            {/* Image File Upload */}

            <label style={{ margin: "10px 0", display: "block" }}>
              Upload Image:
            </label>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ margin: "5px 0" }}
            />

            {/* Update and Close Buttons */}

            <button
              onClick={handleUpdateProduct}
              className="update-btn-admin"
              style={{
                backgroundColor: "#007bff",

                color: "white",

                padding: "10px 20px",

                border: "none",

                borderRadius: "4px",

                margin: "10px 0",

                cursor: "pointer",
              }}
            >
              Update Product
            </button>

            <button
              onClick={closeModal}
              className="cancel-btn-admin"
              style={{
                backgroundColor: "#ff0000",

                color: "white",

                padding: "10px 20px",

                border: "none",

                borderRadius: "4px",

                margin: "10px 0",

                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Update Success Message */}

      {updateSuccessMessage && (
        <div
          className="success-message"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          {updateSuccessMessage}
        </div>
      )}

      {/* Pagination */}

      <div
        className="pagination"
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {Array.from(
          { length: Math.ceil(filteredProducts.length / productsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              style={{
                backgroundColor:
                  currentPage === index + 1 ? "#0056b3" : "#007bff",

                color: "#fff",

                border: "none",

                padding: "10px 20px",

                margin: "0 5px",

                cursor: "pointer",

                borderRadius: "5px",

                transition: "background-color 0.3s ease",
              }}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default UpdateProducts;
