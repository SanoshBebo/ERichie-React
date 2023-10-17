import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import axios from "axios";

import "./Trandingstyle.css";

 

const TrandingPages = () => {

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage] = useState(15);

 

  useEffect(() => {

    // Fetch data from Firestore

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

            stock: data.stock.integerValue, // Include stock information

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

 

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = filteredProducts.slice(

    indexOfFirstItem,

    indexOfLastItem

  );

 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 

  const nextPage = () => {

    if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {

      setCurrentPage(currentPage + 1);

    }

  };

 

  const prevPage = () => {

    if (currentPage > 1) {

      setCurrentPage(currentPage - 1);

    }

  };

 

  return (

    <div className="modified-product-details-container1">

      <h2 className="productlist1">

        Here are the <span className="primary-text1">Mobiles</span> you might

        like

      </h2>

 

      <div className="tranding-page-btn">

        <Link to="/shop11/">

          <button className="back-btn">Back to E-Mobile</button>

        </Link>

 

        <Link to="/mobiles">

          <button className="back-btn">Back to Mobile page</button>

        </Link>

      </div>

 

      <div className="modified-search-bar">

        <input

          type="text"

          placeholder="Search products..."

          value={searchTerm}

          onChange={(e) => setSearchTerm(e.target.value)}

        />

      </div>

 

      <div className="modified-product-details-container">

        {currentProducts.map((product) => (

          <Link

            key={product.id}

            to={product.stock > 0 ? `/shop11/product/${product.id}` : "#"}

            style={{

              pointerEvents: product.stock > 0 ? "auto" : "none",

              opacity: product.stock > 0 ? 1 : 0.5,

              position: "relative",

              display: "inline-block",

            }}

          >

            <div

              className={`modified-product-details-card ${

                product.stock === 0 ? "out-of-stock" : ""

              }`}

              style={{

                position: "relative",

                textAlign: "center",

              }}

            >

              <img src={product.imageurl} alt={product.productname} />

              {product.stock === 0 && (

                <p

                  style={{

                    position: "absolute",

                    top: "50%",

                    left: "50%",

                    transform: "translate(-50%, -50%)",

                    background: "red",

                    color: "white",

                    padding: "10px",

                    borderRadius: "5px",

                    fontWeight: "bold",

                  }}

                >

                  Out of Stock

                </p>

              )}

              <div className="h2text">

                <h2>{product.productname}</h2>

              </div>
              
              <p className="ptext">Price: ₹{product.price}</p>

            </div>

          </Link>

        ))}

      </div>

 

      <div className="tranding-pagination">

        <button onClick={prevPage} disabled={currentPage === 1}>

          Prev

        </button>

        {Array.from({

          length: Math.ceil(filteredProducts.length / itemsPerPage),

        }).map((_, index) => (

          <button

            key={index}

            onClick={() => paginate(index + 1)}

            className={currentPage === index + 1 ? "active" : ""}

          >

            {index + 1}

          </button>

        ))}

        <button

          onClick={nextPage}

          disabled={

            currentPage === Math.ceil(filteredProducts.length / itemsPerPage)

          }

        >

          Next

        </button>

      </div>

    </div>

  );

};

 

export default TrandingPages;