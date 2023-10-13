import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./UserPage.css";
import "./UserPage.jsx";
import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const user = useSelector((state) => state.shoponeuser.user);

  const apiUrl = `https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products/${productId}`;

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productData = response.data.fields;
        setProduct(productData);
      })
      .catch((error) => {
        console.error("Error fetching Product Details: ", error);
      });
  }, [apiUrl]);

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
      console.log(product);
      const cartItem = {
        id: productId,
        name: product.productname.stringValue,
        description: product.description.stringValue,
        stock: product.stock.integerValue,
        shopid: product.shopid.stringValue,
        price: product.price.integerValue,
        imageurl: product.imageurl.stringValue,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };

  return (
    <section className="dhanu">
      <div className="product-details">
        {product ? (
          <div>
            <h2>{product.productname.stringValue}</h2>
            <img
              src={product.imageurl.stringValue}
              alt={product.productname.stringValue}
            />
            <p>Description: {product.description.stringValue}</p>
            <p>Price: ${product.price.integerValue}</p>
            <button>ADD TO CART</button>
            <br></br>
            <Link to="/Shop16/User">
              <strong>CLICK TO SEE MORE PRODUCTS</strong>
            </Link>
            <div className="quantity-input">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1" // Set a minimum value
              />
            </div>

            <button
              onClick={() => {
                addToCart();
              }}
            >
              Add To Cart
            </button>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>

      <div>
        <h5>© 1996-2023, dhanu.com, Inc. or its affiliates</h5>
      </div>
    </section>
  );
}

export default ProductDetails;
