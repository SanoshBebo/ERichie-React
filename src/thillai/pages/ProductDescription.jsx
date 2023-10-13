

import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import axios from 'axios';

import Modal from 'react-bootstrap/Modal';

import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';

import { useDispatch, useSelector } from 'react-redux';

 

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

  const [addedToCart, setAddedToCart] = useState(false);

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

 

    const currentQuantity = productData.fields.quantity.integerValue;

    const newQuantity = currentQuantity - quantity;

 

    if (newQuantity < 0) {

      console.error('Not enough stock available.');

      return;

    }

 

    const updatedStock = newQuantity; // Update the 'stock' field

 

    try {

      // Create an update object to only change the 'stock' field

      const updateObject = {

        fields: {

          stock: {

            integerValue: updatedStock,

          },

        },

      };

 

      // Send a PATCH request with the modified data to update the 'stock' field

      await axios.patch(`https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products/${productId}`, updateObject);

 

      setShowOrderModal(true);

    } catch (error) {

      console.error('Error sending order or updating stock:', error);

    }

  };

 

 

  useEffect(() => {

    if ((!isLoadingUser && user.length === 0) || user.role === "shopkeeper") {

      navigate("/customer/login");

    }

  }, [isLoadingUser, user, navigate]);

 

  const addToCart = () => {

    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.role === "customer") {

      dispatch(setUser(userData));

      const cartItem = {

        id: productId,

        name: productData.fields.productname.stringValue,

        description: productData.fields.description.stringValue,

        stock: productData.fields.stock.integerValue,
        shopid: productData.fields.shopid.stringValue,

        price: productData.fields.price.integerValue,

        imageurl: productData.fields.imageurl.stringValue,

        quantity: quantity,

      };

      dispatch(addItemToCart(cartItem));

      addCartToFirestore(cartItem, userData.email);

      setAddedToCart(true);

      toast.success('Product added successfully', { position: toast.POSITION.TOP_RIGHT });

     

    } else {

      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");

    }

    setIsLoadingUser(false);

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

     

      <Card className="text-center">

        <Card.Header>

          <h1>{productData.fields.productname.stringValue}</h1>

        </Card.Header>

        <Card.Body>

        <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px' }}> {/* Add background color */}

          <Card.Img

            src={imageUrl}

            alt="Product"

            className="img-fluid"

            style={{ maxWidth: '30%', // Set the maximum width

            maxHeight: '30%', // Set the maximum height

            margin: '0 auto',

}}

          />

          </div>

          <Card.Text>Description: {description}</Card.Text>

          <Card.Text>Price: Rs.{price}</Card.Text>

          <div className="quantity-control">

            <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>

            <span>{quantity}</span>

            <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>

          </div>

          <Card.Text>Total Price: Rs.{productData.fields.price.integerValue * quantity}</Card.Text>

          {isOutOfStock ? <p className="text-danger">Out of Stock</p> : null}

          <button

            onClick={() => {

             addToCart();

            }}

            style={{

              backgroundColor: addedToCart ? 'green' : 'blue',

              color: 'white',

            }}

          >

            {addedToCart ? 'Added to Cart' : 'Add to Cart'}

          </button>

          <button

            onClick={() => navigate('/shop07/')}

            style={{

              backgroundColor: 'purple', // Set the color for the "Back to Home" button

              color: 'white',

            }}

          >

            Back to Home

          </button>

        </Card.Body>

      </Card>

      {/* Order Confirmation Modal */}

      <Modal show={showOrderModal} onHide={handleCloseOrderModal}>

        <Modal.Header closeButton>

          <Modal.Title>Order Confirmation</Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <p>Order Placed Successfully!</p>

          <p>Product: {productData.fields.productname.stringValue}</p>

          <p>Quantity: {quantity}</p>

          <p>Total Price: Rs{price * quantity}</p>

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

 