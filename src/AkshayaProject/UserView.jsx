import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cart from './Cart';
import './UserView.css';

const UserView = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch products from Firestore
    const firestoreApiKey = 'AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U';
    const firestoreProjectId = 'e-ritchie';   
    const firestoreCollection = 'Products';

    axios
      .get(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}?key=${firestoreApiKey}`
      )
      .then((response) => {
        const fetchedProducts = response.data.documents.map((doc) => {
          const product = doc.fields;
          const name = product.productname?.stringValue || 'Unknown Product';
          const description = product.description?.stringValue || 'No description available';
          const price = product.price?.doubleValue || 0;
          const stock = product.stock?.integerValue || 0;
          const category = product.category?.stringValue || 'Uncategorized';
          const shopname = product.shopname?.stringValue || 'Unknown Shop';
          const imageUrl = product.imageUrl?.stringValue || '';

          return {
            id: doc.name.split('/').pop(),
            name,
            description,
            price,
            stock,
            category,
            shopname,
            imageUrl,
          };
        });
        setProducts(fetchedProducts);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

  //   const updatedCart = [...cart];
  //   const existingCartItem = updatedCart.find((item) => item.id === selectedProduct.id);

  //   if (existingCartItem) {
  //     existingCartItem.quantity += quantity;
  //   } else {
  //     updatedCart.push({ ...selectedProduct, quantity });
  //   }

    setCart(updatedCart);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    const handleProductClick = (product) => {
      setSelectedProduct(product);
      setQuantity(1);
    
      // Scroll to the product details section
      const productDetailSection = document.getElementById('product-detail-section');
      if (productDetailSection) {
        productDetailSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
      

    // const order = {
    //   product_id: selectedProduct.id,
    //   quantity,
    //   total_price: selectedProduct.price * quantity,
    //   shop_id: selectedProduct.shopname,
    //   user_uid: 'aksh', // Assuming 'aksh' is the user UID
    //   date: generateTimestamp(),
    // };

  //   const firestoreApiKey = 'YOUR_API_KEY';
  //   const firestoreProjectId = 'YOUR_PROJECT_ID';  
  //   const firestoreCollection = 'Products';

  //   axios
  //     .post(
  //       `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}`,
  //       {
  //         fields: {
  //           product_id: { stringValue: order.product_id },
  //           quantity: { integerValue: order.quantity },
  //           total_price: { doubleValue: order.total_price },
  //           shop_id: { stringValue: order.shop_id },
  //           user_uid: { stringValue: order.user_uid },
  //           date: { stringValue: order.date },
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log('Order created successfully:', response.data);
  //       setSelectedProduct(null);
  //       setQuantity(1);
  //       window.alert('Order placed successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error creating order:', error);
  //     });
  // };

  // const generateTimestamp = () => {
  //   const timestamp = new Date();
  //   return timestamp.toISOString();
  };

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchInput.toLowerCase());
  });

  return (
    <div className="user-view-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* <div className="cart-button-container">
        <button className="cart-button">
          <span role="img" aria-label="Cart">
            🛒 {cart.length}
          </span>
        </button>
      </div> */}

      <h2 className="user-view-heading">Products</h2>
      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li key={product.id} className="product-item" onClick={() => handleProductClick(product)}>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.description}, ${product.price}</p>
              <p>
                Stock: {product.stock}, Category: {product.category}, Shop: {product.shopname}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {selectedProduct && (
         <div id="product-detail-section" className="product-detail">
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="product-image" />
          <p>{selectedProduct.description}, ${selectedProduct.price}</p>
          <p>
            Stock: {selectedProduct.stock}, Category: {selectedProduct.category}, Shop: {selectedProduct.shopname}
          </p><button>+</button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min={1}
            max={selectedProduct.stock}
          /><button>-</button>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={quantity > selectedProduct.stock || quantity <= 0}
          >
            Add to Cart
          </button>
          <button
            className="buy-now-button"
            onClick={handleBuyNow}
            disabled={quantity > selectedProduct.stock || quantity <= 0}
          >
            Buy Now
          </button>
          <button onClick={handleCloseProductDetail} className="close-button">
            Close
          </button>


          {quantity > selectedProduct.stock && <p className="out-of-stock-message">Out of Stock</p>}
        </div>
      )}

      {cart.length > 0 && (
        <Cart
          cart={cart}
          removeFromCart={handleRemoveFromCart}
          increaseQuantity={handleIncreaseQuantity}
          decreaseQuantity={handleDecreaseQuantity}
        />
      )}
    </div>
  );
};

export default UserView;
