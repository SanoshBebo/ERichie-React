import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";

function ProductDescriptionPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(0); // Set the initial quantity to 0
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
          console.log(data);
          setProductData(data);
        } else {
          console.error("Failed to fetch product data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }

    fetchProductData();
  }, [productId]);

  const handleQuantityChange = (newQuantity) => {
    if (
      newQuantity >= 0 && // Allow quantities from 0 upwards
      newQuantity <= productData.fields.stock.integerValue
    ) {
      setQuantity(newQuantity);
      setIsOutOfStock(false);
    } else {
      setIsOutOfStock(true);
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

      if (productData.fields.stock.integerValue > 0) {
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

        toast.success("Product added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      //localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }

    setIsLoadingUser(false);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    navigate("/shop07");
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  const imageUrl = productData.fields.imageurl.stringValue;
  const description = productData.fields.description.stringValue;
  const price = productData.fields.price.integerValue;

  return (
    <div>
    <div className="navbar">
      <Link to="/erichie">E-Richie</Link>
      <Link to="/gaming">Go back</Link>
      <Link to="/erichie/cart">🛒 Cart</Link> {/* Unicode character for cart (🛒) */}
          
    </div>

    <div className="container">
      <Card className="text-center">
        <Card.Header>
          <h1>{productData.fields.productname.stringValue}</h1>
        </Card.Header>

        <Card.Body>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {/* Add background color */}
            <Card.Img
              src={imageUrl}
              alt="Product"
              className="img-fluid"
              style={{
                maxWidth: "30%", // Set the maximum width
                maxHeight: "30%", // Set the maximum height
                margin: "0 auto",
              }}
            />
          </div>

          <Card.Text>Description: {description}</Card.Text>

          <Card.Text>Price: Rs.{price}</Card.Text>

          <div className="quantity-control">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              style={{
                backgroundColor: "blue",
                color: "white",
              }}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              style={{
                backgroundColor: "green",
                color: "white",
              }}
            >
              +
            </button>
          </div>

          <Card.Text>
            Total Price: Rs.{productData.fields.price.integerValue * quantity}
          </Card.Text>

          {isOutOfStock ? (
            <p className="text-danger">Out of Stock</p>
          ) : null}

          {productData.fields.stock.integerValue > 0 ? (
            <button
              onClick={() => {
                if (quantity > 0) {
                  addToCart();
                }
              }}
              style={{
                backgroundColor: addedToCart ? "green" : "blue",
                color: "white",
              }}
            >
              {addedToCart ? "Added to Cart" : "Add to Cart"}
            </button>
          ) : (
            <button
              disabled
              style={{ backgroundColor: "gray", color: "white" }}
            >
              Out of Stock
            </button>
          )}

          <button
            onClick={() => navigate("/shop07")}
            style={{
              backgroundColor: "purple",
              color: "white",
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
  </div>
);
}

export default ProductDescriptionPage;
