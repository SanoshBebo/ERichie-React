import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function ProductDescriptionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);

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
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = async () => {
    if (!productData) {
      console.error('No product selected for purchase.');
      return;
    }
  
    // Calculate the total price
    const totalPrice = productData.fields.price.integerValue * quantity;
  
    // Create an object with the order data
    const orderData = {
      Date: { stringValue: new Date().toISOString() },
      ProductID: { stringValue: productId }, // You might need to get the product ID from the URL or another source
      Quantity: { integerValue: quantity },
      ShopID: { stringValue: 'shop07' },
      TotalPrice: { doubleValue: totalPrice },
      UserID: { stringValue: 'yourUserID' },
    };
  
    try {
      // Make an Axios POST request to add orderData to your database
      await axios.post('https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Orders', {
        fields: orderData,
      });
      setShowOrderModal(true);  // Show the order confirmation modal
       // Redirect to the home page
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };
  

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    navigate('/shop07'); 
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{productData.fields.productname.stringValue}</h1>
      <img src={productData.fields.imageurl.stringValue} alt="Product" className="img-fluid" />
      <p>Description: {productData.fields.description.stringValue}</p>
      <p>Price: ${productData.fields.price.integerValue}</p>
      <div className="quantity-control">
        <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
      </div>
      <p>Total Price: ${productData.fields.price.integerValue * quantity}</p>
      <button onClick={handlePurchase}>Purchase</button>

      {/* Order Confirmation Modal */}
      <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Order Placed Successfully!</p>
          <p>Product: {productData.fields.productname.stringValue}</p>
          <p>Quantity: {quantity}</p>
          <p>Total Price: ${productData.fields.price.integerValue * quantity}</p>
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
