

import React, { useState, useEffect } from "react";

import axios from "axios";

import Modal from "react-modal";

const DeleteProducts = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage] = useState(4);

  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

 

  const [products, setProducts] = useState([]);

 

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

            productname: data.productname.stringValue,

            description: data.description.stringValue,

            price: data.price.integerValue,

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

  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 

  const openModal = (product) => {

    setSelectedProduct(product);

    setIsModalOpen(true);

  };

 

  const closeModal = () => {

    setIsModalOpen(false);

  };

 

  const handleDeleteProduct = () => {

    if (!selectedProduct) {

      console.error("Invalid product data");

      return;

    }

 

    const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${selectedProduct.id}`;

 

    axios

      .delete(apiUrl)

      .then((response) => {

        setProducts(products.filter(product => product.id !== selectedProduct.id));

        console.log("Product deleted successfully:", response.data);

        setDeleteSuccessMessage("Product deleted successfully");

        setTimeout(() => {

          setDeleteSuccessMessage("");

        }, 3000);

        closeModal();

      })

      .catch((error) => {

        console.error("Error deleting product:", error);

      });

  };

 

  return (

    <div className="delete-products-container" style={{ textAlign: "center", marginTop: "20px" }}>

      <h1 style={{ color: "red", fontSize: "24px" }}>Delete Product</h1>

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

      <div className="delete-products-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>

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

              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}

              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}

            >

              <img src={product.imageurl} alt={product.productname} className="product-image" style={{ width: "80px", height: "80px", objectFit: "cover", marginBottom: "10px" }} />

              <h3>{product.productname}</h3>

              {/* Delete Button */}

              <button

                onClick={() => openModal(product)}

                className="delete-btn-admin"

                style={{

                  backgroundColor: "#ff0000",

                  color: "white",

                  padding: "10px 20px",

                  border: "none",

                  borderRadius: "5px",

                  cursor: "pointer",

                  marginTop: "10px",

                  transition: "background-color 0.3s ease",

                }}

              >

                Delete

              </button>

            </div>

          ))

        )}

      </div>

      {/* Delete Product Modal */}

      <Modal

        isOpen={isModalOpen}

        onRequestClose={closeModal}

        contentLabel="Delete Product Modal"

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

            height: "200px",

            margin: "0 auto",

            backgroundColor: "#fff",

            padding: "20px",

            borderRadius: "8px",

            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

            textAlign: "center",

          },

        }}

      >

        {/* Delete Product Form */}

        {selectedProduct && (

          <div>

            <h2 style={{ margin: "10px 0" }}>Delete Product</h2>

            <p>Are you sure you want to delete {selectedProduct.productname}?</p>

            {/* Delete and Cancel Buttons */}

            <button

              onClick={handleDeleteProduct}

              className="delete-btn-admin"

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

              Delete Product

            </button>

            <button

              onClick={closeModal}

              className="cancel-btn-admin"

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

              Cancel

            </button>

          </div>

        )}

      </Modal>

      {/* Delete Success Message */}

      {deleteSuccessMessage && (

        <div className="success-message" style={{ backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>

          {deleteSuccessMessage}

        </div>

      )}

      {/* Pagination */}

      <div className="pagination" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>

        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (

          <button

            key={index}

            onClick={() => paginate(index + 1)}

            className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}

            style={{

              backgroundColor: currentPage === index + 1 ? "#0056b3" : "#007bff",

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

        ))}

      </div>

    </div>

  );

};

 

export default DeleteProducts;

 