import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./UserPage.css";
import "./UserPage.jsx";
import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart, addNoOfItemsInCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';
import { CenterFocusStrong } from "@mui/icons-material";



function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const user = useSelector((state) => state.shoponeuser.user);
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)


  const url = `/shop4products/${productId}`;
  let redirectUrl = { 
    url: url,
  };

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
      dispatch(addNoOfItemsInCart(quantity));

      addCartToFirestore(cartItem, userData.email);

       // Show a toast message
       toast.success('Product added to cart!', {
        position: 'top-right',
        autoClose: 3000, // Time in milliseconds to keep the toast open
      });
    } else {
      const url = '/shop4products/${productId}';
      let redirectUrl = {
        url:url,
      }
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };


  return (
    <section className="dc_user">
     
      <div className="product-details">
      <nav className="navbar">
  <h1>Dhanu Computers!</h1>
  <ul className="navbar-list">
    
    <li><Link to='/shop16/user' className='link'>Home</Link></li>
    <li><Link to='/computer' className='link'>Computers Home</Link></li>
    <li><Link to='/erichie/' className='link'>Back to Categories</Link></li>
    <li><Link to="/erichie/cart" className="btn btn-link">
            <AiOutlineShoppingCart style={{ fontSize: '24px' }}/> 
            <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
          </Link></li>
    <li><button >Signout</button></li>
  </ul>
</nav><br></br><br></br><br></br>
<div className="prod-display">
        {product ? (
          <div>
            
            <h1 id="prodname"><strong>{product.productname.stringValue}</strong></h1>
            <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
  <img
    src={product.imageurl.stringValue}
    alt={product.productname.stringValue}
    style={{ maxWidth: '350px', maxHeight: '350px' }}
  />
</div>
            <p><strong>Description: </strong>{product.description.stringValue}</p>
            <p><strong>Price: </strong>Rs. {product.price.integerValue}</p>
            <br></br>
            
            <div className="quantity-input">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0" 
                max={product.stock.integerValue}// Set a minimum value
              />
            </div>


            <button id ="addcart" onClick={() => {addToCart();}}> Add To Cart</button>
            <br />
            

            </div>
        
          
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
      </div>
      <br></br>
        <br></br>
        <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023 Dhanu Computers, Inc. All rights reserved.</p>
          <p>2nd floor , work easy space solutions, Urban Square, S.F No; 278/3A & 9A Kandanchavadi, Rajiv Gandhi Salai, Chennai, 600041</p>
        </div>
      </footer>
    </section>
  );
}

export default ProductDetails;
