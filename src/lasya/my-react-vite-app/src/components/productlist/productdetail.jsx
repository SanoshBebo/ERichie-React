import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../../../Api/CartOperationsFirestore";
import { setUser } from "../../../../../SanoshProject/redux/shopOneUserSlice";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ProductDescPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.shoponeuser.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/products/${productId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const productData = response.data.fields;
        setProduct(productData);
        calculateTotalPrice(productData.price.integerValue, quantity);
      })
      .catch((error) => {
        console.error("Error fetching product data: ", error);
      });
  }, [productId, quantity]);

  const calculateTotalPrice = (price, quantity) => {
    const total = price * quantity;
    setTotalPrice(total);
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
      console.log(product);
      const cartItem = {
        id: productId,
        name: product.productname.stringValue,
        description: product.description.stringValue,
        stock: product.stock.integerValue,
        shopid: product.shopid.stringValue,
        price: product.price.integerValue,
        imageurl: product.imageUrl.stringValue,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);

      toast.success("Product added to cart successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);
  };

  const handleBuyNow = () => {
    // You can customize this part as per your requirements
    // For simplicity, it sets the orderPlaced state to true.
    setOrderPlaced(true);
  };

  const handleClose = () => {
    // Navigate to "/shop05" when the "Close" button is clicked
    navigate("/shop06");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <div className="navbar">
          <Link to="/erichie">Home Page</Link>
          <Link to="/gaming">Go back</Link>
          <Link to="/erichie/cart" className="navbar-button">
            <i className="fa fa-shopping-cart"></i> My Cart
          </Link>
          <a href="/customer/login" className="navbar-button">
            Signout
          </a>
        </div>
      
      <div style={{ textAlign: "center" }}>
        <div className="product-card">
          <h1>{product.productname.stringValue}</h1>
          <img
            src={product.imageUrl.stringValue}
            alt={product.productname.stringValue}
            style={{ width: "70%" }} // Decrease image size to 40%
          />
          <p>Description: {product.description.stringValue}</p>
          <p>Price: Rs.{product.price.integerValue}</p>
          <div className="quantity-control">
            <label>Quantity: </label>
            <button
              className="quantity-button"
              onClick={() => {
                const newQuantity = quantity - 1 > 0 ? quantity - 1 : 1;
                setQuantity(newQuantity);
                calculateTotalPrice(product.price.doubleValue, newQuantity);
              }}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10) || 1;
                setQuantity(newQuantity);
                calculateTotalPrice(product.price.integerValue, newQuantity);
              }}
            />
            <button
              className="quantity-button"
              onClick={() => {
                setQuantity(quantity + 1);
                calculateTotalPrice(product.price.integerValue, quantity + 1);
              }}
            >
              +
            </button>
          </div>
          <p>Total Price: Rs.{totalPrice}</p>
          <button
            className="buy-button"
            onClick={() => {
              addToCart();
            }}
          >Add To Cart
            <Link to="/erichie/cart"></Link>
          </button>

          <span style={{ color: "white" }}>Add to Cart</span>

          <button
            className="back-button"
            onClick={() => {
              navigate("/shop06"); // Use the navigate function to go back to the home page
            }}
          >
            <span style={{ color: "white" }}>Back to Home</span>
          </button>
          {orderPlaced && (
            <div>
              <div className="overlay" />
              <div className="popup">
                <p>Order Successfully Placed</p>
                <button className="close-button" onClick={handleClose}>
                  Close
                </button>
                {/* You can add additional information or actions here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDescPage;
