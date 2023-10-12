import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from '../../SanoshProject/redux/shopOneUserSlice';
import { addItemToCart } from '../../SanoshProject/redux/shopOneCartSlice';
import { addCartToFirestore } from '../../Api/CartOperationsFirestore';


function ProductDescriptionPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const user = useSelector((state) => state.shoponeuser.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await axios.get(
          `https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products/${productId}`
        );
        if (response.status === 200) {
          const data = response.data;
          setProductData(data);
        } else {
          console.error('Failed to fetch product data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    fetchProductData();
  }, [productId]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= productData.fields.stock.integerValue) {
      setQuantity(newQuantity);
      setIsOutOfStock(false);
    } else {
      setIsOutOfStock(true);
    }
  };

  const handlePurchase = async () => {
    if (!productData || isOutOfStock) {
      console.error('No product selected for purchase or out of stock.');
      return;
    }
  
    // Calculate the new quantity
    const currentQuantity = productData.fields.quantity.integerValue;
    const newQuantity = currentQuantity - quantity;
  
    if (newQuantity < 0) {
      console.error('Not enough stock available.');
      return;
    }
  

    // Calculate the total price
    const totalPrice = productData.fields.price.integerValue * quantity;

    // Create an object with the order data
    const orderData = {
      Date: { stringValue: new Date().toISOString() },
      ProductID: { stringValue: productId },
      Quantity: { integerValue: quantity },
      ShopID: { stringValue: 'shop07' },
      TotalPrice: { doubleValue: totalPrice },
      UserID: { stringValue: 'yourUserID' },
    };

  
    // Create an object with the updated product data
    const updatedProductData = {
      ...productData,
      fields: {
        ...productData.fields,
        quantity: { integerValue: newQuantity },
      },
    };
  

    try {
      // Make an Axios POST request to add orderData to your order database
      await axios.post('https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Orders', {
        fields: orderData,
      });

  
      // Make an Axios PUT or PATCH request to update the product quantity in your product database
      await axios.patch(`https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products/${productId}`, {
        fields: updatedProductData.fields,
      });
  
      setShowOrderModal(true); // Show the order confirmation modal


    } catch (error) {
      console.error('Error sending order or updating product:', error);
    }
  };

  
  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
      console.log(product);
      const cartItem = {
        id: productId,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        price: product.price,
        imageurl: product.imageUrl,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
      toast.success('Product added successfully', { position: toast.POSITION.TOP_RIGHT });
    } else {
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };


  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    navigate('/shop07');
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  const imageUrl = productData.fields.imageurl.stringValue;
  const description = productData.fields.description.stringValue;
  const price = productData.fields.price.integerValue;

  return (
    <div className="container">
      <h1>{productData.fields.productname.stringValue}</h1>
      <img
        src={imageUrl}
        alt="Product"
        className="img-fluid"
        style={{ display: 'block', margin: '0 auto', width: '50%', height: 'auto' }}
      />
      <p>Description: {description}</p>
      <p>Price: ${price}</p>
      <div className="quantity-control">
        <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
      </div>

      <p>Total Price: ${productData.fields.price.integerValue * quantity}</p>

 

      {isOutOfStock ? <p className="text-danger">Out of Stock</p> : null}
      <p>Total Price: ${price * quantity}</p>
      <button onClick={() => {
  handlePurchase();
  addToCart();
}}>
  Add to Cart
</button>
<button onClick={() => {
      history.push('/shop07/'); // Replace '/' with the actual URL of your home page
     }}>
  Back to Home
   </button>


      {/* Order Confirmation Modal */}
      <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Order Placed Successfully!</p>
          <p>Product: {productData.fields.productname.stringValue}</p>
          <p>Quantity: {quantity}</p>
          <p>Total Price: ${price * quantity}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseOrderModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductDescriptionPage;
