

import React, { useState, useEffect } from "react";

import axios from "axios";

 

const ViewProducts = () => {

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage] = useState(4);

 

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

 

  useEffect(() => {

    const filtered = products.filter(product =>

      product.productname.toLowerCase().includes(searchTerm.toLowerCase())

    );

    setFilteredProducts(filtered);

  }, [products, searchTerm]);

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const openModal = (product) => {

    setSelectedProduct(product);

    setIsModalVisible(true);

  };

  const closeModal = () => {

    setSelectedProduct(null);

    setIsModalVisible(false);

  };

  return (

    <div className="modified-product-details-container-view" style={{ textAlign: "center", marginTop: "20px" }}>

      {/* Search bar */}

      <div className="modified-search-bar-view" style={{ margin: "20px 0" }}>

        <input

          type="text"

          placeholder="Search products..."

          value={searchTerm}

          onChange={(e) => setSearchTerm(e.target.value)}

          style={{

            padding: "10px",

            borderRadius: "5px",

            border: "1px solid #007bff",

            fontSize: "16px",

            outline: "none",

            width: "300px"

          }}

        />

      </div>

      {/* Product cards */}

      <div className="modified-product-details-container-view" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>

        {currentProducts.map((product) => (

          <div key={product.id} className="modified-product-details-card-view" style={{

            border: "1px solid #ccc",

            padding: "20px",

            margin: "10px",

            width: "200px",

            transition: "transform 0.3s ease",

            cursor: "pointer"

          }}

            onClick={() => openModal(product)}>

            <img src={product.imageurl} alt={product.productname} style={{ width: "100%", height: "150px", objectFit: "cover" }} />

            <h2>{product.productname}</h2>

            <p>Price: ₹{product.price}</p>

          </div>

        ))}

      </div>

      {/* Pagination */}

      <div className="modified-pagination-view" style={{ margin: "20px 0" }}>

        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (

          <button key={index} onClick={() => paginate(index + 1)} style={{

            backgroundColor: "#007bff",

            color: "#fff",

            border: "none",

            padding: "10px 20px",

            margin: "0 5px",

            cursor: "pointer",

            borderRadius: "5px",

            transition: "background-color 0.3s ease"

          }}>

            {index + 1}

          </button>

        ))}

      </div>

      {/* Modal */}

      {isModalVisible && (

        <div className="modified-details-modal-view" style={{

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          position: "fixed",

          top: 0,

          left: 0,

          width: "100%",

          height: "100%",

          backgroundColor: "rgba(0, 0, 0, 0.5)"

        }}>

          <div className="modified-details-modal-content-view" style={{

            width: "300px",

            backgroundColor: "#fff",

            padding: "20px",

            borderRadius: "8px",

            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"

          }}>

            <span className="modified-close" onClick={closeModal} style={{

              float: "right",

              fontSize: "28px",

              cursor: "pointer"

            }}>&times;</span>

            <img src={selectedProduct.imageurl} alt={selectedProduct.productname} style={{ width: "100%", height: "200px", objectFit: "cover" }} />

            <h2>{selectedProduct.productname}</h2>

            <p>{selectedProduct.description}</p>

            <p>Price: ₹{selectedProduct.price}</p>

            <button onClick={closeModal} style={{

              backgroundColor: "#007bff",

              color: "#fff",

              border: "none",

              padding: "10px 20px",

              borderRadius: "4px",

              marginRight: "10px",

              cursor: "pointer"

            }}>Close</button>

          </div>

        </div>

      )}

    </div>

  );

};

export default ViewProducts;