

import React, { useState, useEffect } from "react";

import axios from "axios";

import "./UserPage.css";

import { Link, useNavigate } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";

 

function UserPage1() {

  const [products, setProducts] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cartItems, setCartItems] = useState([]); // Track items in the cart

  const [cartCount, setCartCount] = useState(0); // Cart count based on unique products

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Current page number

  const [productsPerPage] = useState(6); // Number of products to show per page

  const navigate = useNavigate();

 

  const handleSignOut = () => {

    localStorage.removeItem("user");

    navigate("/customer/login");

  };

 

  const isProductAvailable = (product) => {

    const stock = product.fields.stock?.integerValue || 0;

    return stock > 0;

  };

 

  const apiUrl =

    "https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products";

 

  useEffect(() => {

    axios

      .get(apiUrl)

      .then((response) => {

        const productList = response.data.documents.map((doc) => ({

          id: doc.name.split("/").pop(),

          fields: doc.fields,

        }));

        setProducts(productList);

        setFilteredProducts(productList);

      })

      .catch((error) => {

        console.error("Error fetching Products: ", error);

      });

  }, []);

 

  useEffect(() => {

    const searchTerm = searchInput.toLowerCase();

    const filtered = products.filter((product) =>

      product.fields.productname?.stringValue

        ?.toLowerCase()

        .includes(searchTerm)

    );

    setFilteredProducts(filtered);

  }, [searchInput, products]);

 

  const handleSearch = () => {

    const searchTerm = searchInput.toLowerCase();

    const filtered = products.filter((product) =>

      product.fields.productname?.stringValue

        ?.toLowerCase()

        .includes(searchTerm)

    );

    setFilteredProducts(filtered);

  };

 

  const openProductModal = (product) => {

    setSelectedProduct(product);

  };

 

  const closeProductModal = () => {

    setSelectedProduct(null);

  };

 

  const addToCart = () => {

    if (selectedProduct) {

      // Check if the selected product is already in the cart

      const existingItem = cartItems.find(

        (item) => item.id === selectedProduct.id

      );

 

      if (!existingItem) {

        // If not, add it to the cart

        setCartItems([...cartItems, selectedProduct]);

      }

 

      // Increment cart count based on unique products

      setCartCount((prevCount) => prevCount + 1);

 

      closeProductModal();

      setShowOrderConfirmation(true);

    }

  };

 

  const addOrderToFirestore = () => {

    if (selectedProduct) {

      const firestoreOrdersUrl =

        "https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Orders";

 

      const orderObject = {

        fields: {

          totalprice: {

            integerValue: selectedProduct.fields.price?.integerValue || 0,

          },

          userid: { stringValue: "123456" }, // Replace with the actual user ID

          quantity: { stringValue: "1" }, // Assuming you add one item at a time

          date: { timestampValue: new Date().toISOString() },

          shopid: { stringValue: selectedProduct.id },

        },

      };

 

      axios

        .post(firestoreOrdersUrl, orderObject)

        .then((response) => {

          console.log("Order added to Firestore:", response.data);

          // Handle success, e.g., show a success message to the user

          setOrderPlaced(true); // Set orderPlaced to true here

        })

        .catch((error) => {

          console.error("Error adding order to Firestore:", error);

          if (error.response) {

            console.log("Error response data:", error.response.data);

          }

          // Handle error, e.g., show an error message to the user

        });

    }

  };

 

  // Calculate the start and end indexes for products on the current page

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(

    indexOfFirstProduct,

    indexOfLastProduct

  );

 

  // Generate an array of page numbers

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {

    pageNumbers.push(i);

  }

 

  // Handle page change

  const handlePageChange = (pageNumber) => {

    setCurrentPage(pageNumber);

  };

 

  return (

    <div className="user-page">

      <header className="navbar">

        <nav>

          <ul className="list-elements">

            <li>

              <i className="fa fa-shopping-cart cart">

                {cartCount > 0 && (

                  <span className="cart-count">{cartCount}</span>

                )}

              </i>

            </li>

           

            <li>

              <Link to="/gaming">Go Back to Home</Link>

            </li>

            <li>

              <Link to="/erichie">HomePage</Link>

            </li>

            <li

              className="cursor-pointer hover:underline"

              onClick={handleSignOut}

            >

              Sign Out

            </li>

            <li>

 

            <Link to="/erichie/cart" style={{ fontSize: '30px' }}>🛒</Link>

 

</li>

            <li>

              <div className="search-bar">

                <input

                  className="search-inputss"

                  type="text"

                  placeholder="Search for Products"

                  value={searchInput}

                  onChange={(e) => setSearchInput(e.target.value)}

                />

                <button className="rethu-search" onClick={handleSearch}>Search</button>

 

               

              </div>

            </li>

          </ul>

        </nav>

      </header>

 

 

 

      <div class="title-container">

        <div class="title-words">

            <div class="title"><h1 class="title">Dead Eye Game Store</h1></div>

        </div>

  </div>

 

 

 

      <div className="product-list">

        {currentProducts.map((product) => (

          <div key={product.id} className="product-item">

            <img

              src={product.fields.imageurl?.stringValue || ""}

              alt={product.fields.productname?.stringValue || ""}

              className="product-image2" // Add class to center-align images

            />

            <h4>{product.fields.productname?.stringValue || ""}</h4>

            <p>Price: ₹ {product.fields.price?.integerValue || 0}</p>

 

            <Link to={`/shop05/product/${product.id}`}>

              <button onClick={() => openProductModal(product)}>Add to Cart</button>

            </Link>

          </div>

        ))}

      </div>  

      {/* Pagination */}

      <div className="pagination">

        {pageNumbers.map((number) => (

          <button

            key={number}

            className={`pagination-button ${

              number === currentPage ? "active" : ""

            }`}

            onClick={() => handlePageChange(number)}

          >

            {number}

          </button>

        ))}

       

      </div>

      <footer className="footer">

 

<div className="footer-content">

 

  <p>&copy; 2023 Dead Eye Game Store, Inc. All rights reserved.</p>

 

  <p>Ritchie Street,

Mount Road,

Anna Salai,

Chennai, 600002,

Tamil Nadu, India</p>

 

</div>

 

</footer>

    </div>

   

  );

}

 

export default UserPage1;

 