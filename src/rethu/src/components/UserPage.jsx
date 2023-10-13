import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

//const history = useHistory();
function UserPage1() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]); // Track items in the cart
  const [cartCount, setCartCount] = useState(0); // Cart count based on unique products
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const navigate = useNavigate();


  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/customer/login");
  };

  const handleBuyNow = (product) => {
    // You can add any additional functionality here, e.g., adding the product to the cart
    navigate(`/product/${product.id}`);

  };



  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products';

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((error) => {
        console.error('Error fetching Products: ', error);
      });
  }, []);

  useEffect(() => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname?.stringValue?.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchInput, products]);

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname?.stringValue?.toLowerCase().includes(searchTerm)
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
      const existingItem = cartItems.find((item) => item.id === selectedProduct.id);

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
        'https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Orders';
  
      const orderObject = {
        fields: {
          totalprice: { doubleValue: selectedProduct.fields.price?.doubleValue || 0 },
          userid: { stringValue: '123456' }, // Replace with the actual user ID
          quantity: { stringValue: '1' }, // Assuming you add one item at a time
          date: { timestampValue: new Date().toISOString() },
          shopid: { stringValue: selectedProduct.id },
        },
      };
  
      axios
      .post(firestoreOrdersUrl, orderObject)
      .then((response) => {
        console.log('Order added to Firestore:', response.data);
        // Handle success, e.g., show a success message to the user
        setOrderPlaced(true); // Set orderPlaced to true here
      })
      .catch((error) => {
        console.error('Error adding order to Firestore:', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
        }
        // Handle error, e.g., show an error message to the user
      });
    }
  };
  
  return (
    <div className="user-page">
      <header className="navbar">
        <nav>
        <ul className="list-elements">
           
            <li>
              <i className="fa fa-shopping-cart cart">
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </i>
            </li>
            <li>
              <div className="search-bar">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search for Products"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
              </div>
            </li>
            <li
              className="cursor-pointer hover:underline"
              onClick={handleSignOut}
            >
              Sign Out
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
          </ul>
        
        </nav>
      </header>

      <div>
        <h1 className="store-name">Welcome to the Dead Eye Game Store!</h1>
      </div>
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item">
            {/* ... (your product display code) ... */}
            <img
              src={product.fields.imageUrl?.stringValue || ''}
              alt={product.fields.productname?.stringValue || ''}
              className="product-image2"
              style={{ width: '50%' }} // Set the width to 30%
            />
            <h4>{product.fields.productname?.stringValue || ''}</h4>
            <p>Price: ${product.fields.price?.doubleValue || 0}</p>
           
          <Link to={`/shop05/product/${product.id}`}>
          <button >Add to Cart</button>
          </Link>
           
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay">
<div className="product-modal">
          <span className="close-modal" onClick={closeProductModal}>
            &times;
          </span>
          <img
            src={selectedProduct.fields.imageUrl?.stringValue || ''}
            alt={selectedProduct.fields.productname?.stringValue || ''}
            className="product-modal-image"
          />
          <h2>{selectedProduct.fields.productname?.stringValue || ''}</h2>
          <p>{selectedProduct.fields.description?.stringValue || ''}</p>
          <p>Price: ${selectedProduct.fields.price?.doubleValue || 0}</p>
         
          <Link to={`/shop05/product/${products.productid}`}>
          <button >Add to Cart</button>
          </Link>
        </div>
      </div>
    )}
    {showOrderConfirmation && (
  <div className="order-confirmation-popup">
    <p>Order Successfully Placed</p>
    <button onClick={() => setShowOrderConfirmation(false)}>Close</button>
  </div>
)}
  </div>
  );
}

export default UserPage1;
