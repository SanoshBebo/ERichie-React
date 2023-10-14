import React, { useState, useEffect } from "react";

import axios from "axios";

const DeleteProducts = () => {
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage] = useState(4);

  useEffect(() => {
    // Fetch data from Firestore

    axios

      .get(
        "https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products"
      )

      .then((response) => {
        // Extract product data from the response

        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;

          return {
            id: doc.name.split("/").pop(),

            productname: data.productname.stringValue,

            description: data.description.stringValue,

            price: data.price.integerValue,

            imageurl: data.imageurl.stringValue,
          };
        });

        // Set products state with the retrieved data

        setProducts(productsData);
      })

      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);

    setIsConfirmationVisible(true);
  };

  const handleDeleteProduct = () => {
    // Construct the API URL for the selected product

    const apiUrl = `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${selectedProduct.id}`;

    // Send DELETE request to the API endpoint

    axios

      .delete(apiUrl)

      .then((response) => {
        console.log("Product deleted successfully:", response.data);

        // Remove the deleted product from the local state

        setProducts(
          products.filter((product) => product.id !== selectedProduct.id)
        );

        setSuccessMessage("Product deleted successfully");

        setIsConfirmationVisible(false);

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      })

      .catch((error) => {
        console.error("Error deleting product:", error);
      });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Ensure current page is within valid range

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    const indexOfLastProduct = currentPage * productsPerPage;

    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = filteredProducts
      .slice(indexOfFirstProduct, indexOfLastProduct)

      .filter((product) =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase())
      )

      .slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="delete-products-container1">
      <div className="search-bar">
        <h1 style={{ color: "red", fontSize: "24px", textAlign: "center" }}>
          Delete Product
        </h1>

        {/* Search bar */}

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

            ":hover": {
              background: "#0056b3",
            },
          }}
        />
      </div>

      <div
        className="main-delete-container"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {filteredProducts.map((product) => (
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
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Display product details */}

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

            {/* <p>Description: {product.description}</p> */}

            <p>Price: ${product.price}</p>

            <p>Shop Name: {product.shopname}</p>

            <p>Stock: {product.stock}</p>

            {/* Delete button */}

            <button
              onClick={() => handleDeleteClick(product)}
              className="delete-btn-admin"
              style={{
                backgroundColor: "#007bff",

                color: "white",

                padding: "10px 20px",

                border: "none",

                borderRadius: "5px",

                cursor: "pointer",

                marginTop: "10px",

                transition: "background-color 0.3s ease",

                ":hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

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
                  currentPage === index + 1 ? "#0056b3" : "#007bff", // Change background color for active button
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

      {/* Confirmation dialog */}

      {/* Confirmation dialog */}

      {isConfirmationVisible && (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            border: "1px solid #007bff",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
            textAlign: "center",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1000",
          }}
        >
          <h2>Delete Product</h2>

          <p>Are you sure you want to delete {selectedProduct.productname}?</p>

          <button
            onClick={handleDeleteProduct}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Delete Product
          </button>

          <button
            onClick={() => setIsConfirmationVisible(false)}
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Success message popup */}

      {successMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#28a745",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: "999",
            textAlign: "center",
            fontSize: "18px",
            color: "white",
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default DeleteProducts;
