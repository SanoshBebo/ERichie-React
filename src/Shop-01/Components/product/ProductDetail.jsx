
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './ProductDetail.css'; // Import the CSS file
import '../../harinistyles.css'
const firebaseConfig = {
  apiKey: "AIzaSyBV81LLXLpCtn-8rGdcrLyrIg4mwhCvkZA",
  authDomain: "crud-550f3.firebaseapp.com",
  projectId: "crud-550f3",
  storageBucket: "crud-550f3.appspot.com",
  messagingSenderId: "798322035823",
  appId: "1:798322035823:web:8d8c9b1d108ce5e293919a",
  measurementId: "G-Y7TFJ7XBQ1"
};


import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";




// Check if Firebase is not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function ProductDetail() {
  const { documentId } = useParams(); // Get the documentId from the URL parameter
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Function to fetch product details based on the documentId
    const fetchProductDetails = async () => {
      try {
        const productRef = await firebase
          .firestore()
          .collection('Products')
          .doc(documentId)
          .get();

        if (productRef.exists) {
          const productData = productRef.data();
          setProduct(productData);
        } else {
          console.log(`Product with document ID ${documentId} not found.`);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    // Call the function to fetch product details
    fetchProductDetails();
  }, [documentId]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // const addToCart = () => {
  //   if (quantity === 0) {
  //     // Quantity is 0, show an alert
  //     alert('Please select a quantity before adding to cart.');
  //     return;
  //   }
  
  //   // Create a cart item object
  //   const cartItem = {
  //     product: product,
  //     quantity: quantity,
  //   };
  
  //   // Add the cart item to the Firestore "carts" collection
  //   firebase.firestore().collection('carts').add(cartItem)
  //     .then(() => {
  //       alert('Product added to cart successfully.');
  //       // Optionally, you can reset the quantity here
  //       setQuantity(0);
  //     })
  //     .catch((error) => {
  //       console.error('Error adding product to cart:', error);
  //     });
  // };

  // const purchaseNow = () => {
  //   if (quantity === 0) {
  //     // Quantity is 0, show an alert
  //     alert('Please select a quantity before making a purchase.');
  //     return; // Stop further execution
  //   }

  //   // Fetch the current stock of the product
  //   const currentStock = product.stock;

  //   if (currentStock < quantity) {
  //     alert('Not enough stock available.');
  //     return; // Stop further execution
  //   }

  //   // Calculate the new stock value
  //   const newStock = currentStock - quantity;

  //   // Prepare the order data
  //   const orderData = {
  //     productid: documentId,
  //     date: new Date().toISOString(),
  //     quantity: quantity,
  //     shopid: 'shop17',
  //     totalprice: quantity * product.price,
  //   };

  //   // Update the stock in the 'products' collection
  //   firebase
  //     .firestore()
  //     .collection('Products')
  //     .doc(documentId)
  //     .update({
  //       stock: newStock,
  //     })
  //     .then(() => {
  //       // Stock updated successfully, now add the order data to the 'orders' collection
  //       firebase
  //         .firestore()
  //         .collection('Orders')
  //         .add(orderData)
  //         .then(() => {
  //           alert('Order placed successfully');
  //           console.log('Order placed successfully');
  //           // Optionally, you can reset the quantity here
  //           setQuantity(0);
  //         })
  //         .catch((error) => {
  //           console.error('Error placing the order:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error updating stock:', error);
  //     });
  // };
  const user = useSelector((state) => state.shoponeuser.user);

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch(); // You can use useDispatch here
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
      const cartItem = {
        id: documentId,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        price: product.price,
        imageurl: product.imageurl,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
    } else {
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };



  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {product ? (
          <>
            <div>
              <img
                src={product.imageurl}
                alt={product.productname}
                className="product-image"
              />
            </div>
            <div >
            <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
              <h1 style={{ color: 'black', marginBottom: '10px' }}>
                {product.productname}
              </h1>
              <h3>{product.description}</h3>
              <p>Availability: {product.stock}</p>
              <p> Rs:{product.price}</p>

              <div className="quantity-control">
                <button className="quantity-button" onClick={decreaseQuantity}>
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="quantity-input"
                />
                <button className="quantity-button" onClick={increaseQuantity}>
                  +
                </button>
              </div>
              
              <button className="purchase-button" >
                Purchase now
              </button>
              <button className="purchase-button" onClick={() => {addToCart();}}>
                Add to Cart
              </button>
              </div>
            </div>
          </>
        ) : (
          <p>Product not found</p>
        )}
      </div>
    </div>
  );
        }


export default ProductDetail;



























































