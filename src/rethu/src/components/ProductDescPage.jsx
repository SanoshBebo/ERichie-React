import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";

function ProductDescPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shoponeuser.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products/${productId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const productData = response.data.fields;
        console.log(productData);
        setProduct(productData);
        calculateTotalPrice(productData.price.doubleValue, quantity);
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
    } else {
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };

  const handleBuyNow = () => {
    // You can customize this part as per your requirements
    // For simplicity, it sets the orderPlaced state to true.
    setOrderPlaced(true);
  };

  const handleClose = () => {
    // Navigate to "/shop05" when the "Close" button is clicked
    navigate("/shop05");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-description">
      <h1>{product.productname.stringValue}</h1>
      <p>Product ID: {productId}</p>
      <img
        src={product.imageUrl.stringValue}
        alt={product.productname.stringValue}
      />
      <p>Description: {product.description.stringValue}</p>
      <p>Price: ${product.price.doubleValue}</p>

      <label>Quantity: </label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value, 10) || 1;
          setQuantity(newQuantity);
        }}
      />

      <p>Total Price: ${totalPrice}</p>

      <button
        onClick={() => {
          addToCart();
        }}
      >
        Buy Now
      </button>

      {orderPlaced && (
        <div>
          <div className="overlay" />
          <div className="popup">
            <p>Order Successfully Placed</p>
            <button onClick={handleClose}>Close</button>
            {/* You can add additional information or actions here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDescPage;