import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckOut.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';


import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";
import { useDispatch, useSelector } from "react-redux";


const CheckoutPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const user = useSelector((state) => state.shoponeuser.user);
  const [isAddedToCart, setIsAddedToCart] = useState(false);


  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      if (!id) {
        console.error('Invalid product ID:', id);
        return;
      }

      // Use environment variables for the API key
      const apiKey = 'AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ';
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products/${id}?key=${apiKey}`;

      const response = await axios.get(firestoreUrl);

      if (response.status === 200 && response.data) {
        const productData = response.data.fields;

        setProduct({
          id,
          productname: productData.productname?.stringValue || 'No name available',
          description: productData.description?.stringValue || 'No description available',
          price: productData.price?.integerValue || 0,
          imageurl: productData.imageurl?.stringValue || 'No image available',
          stock: productData.stock?.integerValue || 0,
          shopid: productData.shopid?.stringValue || 'shop15',
          category: productData.category?.stringValue || 'computers',
        });
      } else {
        console.error('Failed to fetch product data:', response);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

 

  const handleIncreaseQuantity = () => {
    if(quantity+1<= product.stock){
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
    
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };


 


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
        id: product.id,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        price: product.price,
        shopid : product.shopid,
        imageurl: product.imageurl,
        quantity: quantity,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
      setIsAddedToCart(true);

    // For example, you can use the useContext hook or a Redux store to manage the cart state.
      toast.success('Product added to the cart', { autoClose: 2000 });

    } else {
      const url = `/checkout/${productId}`;
      let redirectUrl = {
        url: url,
      };

      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));

      navigate("/customer/login");

    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };



  return (
    <>
    <section className='shop15style'>
      <Header disabled={true}/>
      <div className="shop15checkout">
      <h1 style={{ color: 'red' }}>Sanjay Computers</h1>
        <h1>Checkout</h1>
        {product && (
          <div className="shop15productsdetails">
            <img src={product.imageurl} alt={`Image for ${product.productname}`} />
            <strong>Product Name:</strong> {product.productname}<br />
            <strong>Price:</strong> Rs. {product.price}<br />
            <p>{product.description}</p>
            <strong>Stock Left:</strong>{product.stock}<br />
            <strong>Quantity:</strong> 
            <button onClick={handleDecreaseQuantity}>-</button>
            {quantity}
            <button onClick={handleIncreaseQuantity}>+</button><br />
            <strong>Total Price: {quantity * product.price}</strong>

            <button

className="purchase-button"

onClick={() => {

  if (!isAddedToCart && product.stock > 0) {

    addToCart();

  }

}}

disabled={isAddedToCart || product.stock <= 0}

>

{isAddedToCart ? 'Added' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}

</button>
          </div>
        )}
        
        
      </div>
      </section>
      <ToastContainer position="top-right" />
    </>
  );
};

export default CheckoutPage;
