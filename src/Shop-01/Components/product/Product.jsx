

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ProductList.css';
// import { Link } from 'react-router-dom';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

// function ProductCard({ product, addToCart }) {
//   const [quantity, setQuantity] = useState(1);

//   const handleAddToCart = () => {
//     // Create a cart item object
//     const cartItem = {
//       product: product,
//       quantity: quantity,
//     };

//     // Call the addToCart function passed from the parent component
//     addToCart(cartItem);
//   };

//   return (
//     <div className="product-card">
//       <h2>{product.productname}</h2>
//       <p>{product.description}</p>
//       <p>Rs:{product.price}</p>
//       <img src={product.imageUrl} alt={product.productname} />
//       <div className="product-buttons">
//         <button>
//           <Link to={`/Products/${product.id}`}>View Product</Link>
//         </button>
//         <div className="add-to-cart" style={{display:'inline'}}>
          
//           <button onClick={handleAddToCart}>Add to Cart</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ProductComponent() {
//   const [products, setProducts] = useState([]);

//   // Function to add an item to the cart in Firebase
//   const addToCart = (cartItem) => {
//     // Add the cart item to the 'carts' collection in Firebase
//     firebase.firestore().collection('carts').add(cartItem);
//   };

//   const apiUrl = "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products";

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(apiUrl);
//       const productsData = response.data.documents.map((doc) => {
//         const fields = doc.fields;
//         return {
//           id: doc.name.split('/').pop(),
//           productname: fields.productname.stringValue,
//           description: fields.description.stringValue,
//           stock: fields.stock.integerValue,
//           price: fields.price.doubleValue,
//           imageUrl: fields.imageurl.stringValue,
//         };
//       });
//       setProducts(productsData);
//     } catch (error) {
//       console.error('Error reading products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       <h1 className='product-h1'>Products</h1>
//       <div className="product-list">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} addToCart={addToCart} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProductComponent;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import '../../harinistyles.css'
function ProductCard({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Create a cart item object
    const cartItem = {
      product: product,
      quantity: quantity,
    };

    // Call the addToCart function passed from the parent component
    addToCart(cartItem);
  };


  return (
    <div className="product-card">
      <h2>{product.productname}</h2>
      <p>{product.description}</p>
      <p>Rs:{product.price}</p>
      <img src={product.imageUrl} alt={product.productname} />
      <div className="product-buttons">
        <button>
          <Link to={`/Products/${product.id}`}>View Product</Link>
        </button>
        
      </div>
    </div>
  );
}

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Function to add an item to the cart in Firebase
  const addToCart = (cartItem) => {
    // Add the cart item to the 'carts' collection in Firebase
    firebase.firestore().collection('carts').add(cartItem);
  };

  const apiUrl = "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(apiUrl);
      const productsData = response.data.documents.map((doc) => {
        const fields = doc.fields;
        return {
          id: doc.name.split('/').pop(),
          productname: fields.productname.stringValue,
          description: fields.description.stringValue,
          stock: fields.stock.integerValue,
          price: fields.price.integerValue,
          imageUrl: fields.imageurl.stringValue,
        };
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Error reading products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Function to filter and paginate products
  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='container'>
    <hr/>
      <h1 className='product-h1'>Products</h1>
      <div className="search-bar" style={{width:'600px'}}>
        <input
          className='input-bar'
          style={{width:'100%', marginTop:'50px'}}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="product-list">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      <div className="pagination">
        {Array(Math.ceil(filteredProducts.length / productsPerPage))
          .fill()
          .map((_, i) => (
            <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
              {i + 1}
            </button>
          ))}
      </div>
    </div>
  );
}

export default ProductComponent;
