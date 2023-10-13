import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setUser } from '../../SanoshProject/redux/shopOneUserSlice';
import { addItemToCart } from '../../SanoshProject/redux/shopOneCartSlice';
import { addCartToFirestore } from '../../Api/CartOperationsFirestore';
import { useDispatch, useSelector } from 'react-redux';

const ProductFetch = ({ cart, setCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(
        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${id}`
      )
      .then((response) => {
        const firestoreData = response.data;
        const productData = firestoreData && firestoreData.fields;

        if (productData) {
          console.log(productData)
          setProduct({
            productname: productData.productname.stringValue || '',
            description: productData.description.stringValue || '',
            price: productData.price.integerValue|| '',
            stock: productData.stock.integerValue|| '',
            imageurl: productData.imageUrl.stringValue || '',
          });

          if (productData.imageUrl) {
            setImageUrl(productData.imageUrl.stringValue || '');
          }
          if (productData.price) {
            setPrice(parseInt(productData.price.integerValue, 10)); // Assuming the price is stored as an integer
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

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
        id: id,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        shopid: product.shopid,
        price: product.price,
        imageurl: product.imageurl,
        quantity: quantity,
      };
      console.log(cartItem)
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Link to="/shop12/customer" className="bg-purple-500 text-white py-2 px-4 rounded-lg mb-4">
        Back to Home
      </Link>
      <h2 className="text-3xl font-semibold mb-2">{product.productname}</h2>
      <p className="text-gray-700 mb-4">{product.description}</p>
      {imageUrl && (
        <img src={imageUrl} alt={product.productname} className="w-64 h-64 object-cover mx-auto mb-4" />
      )}
      <div className="flex flex-col items-center mb-4">
        <p className="text-2xl font-bold text-purple-500 mb-2">Price: ${price}</p>
        <div className="flex items-center space-x-4">
          <button
            onClick={decreaseQuantity}
            className="bg-gray-200 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
          >
            -
          </button>
          <span className="text-xl">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="bg-gray-200 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
          >
            +
          </button>
        </div>
        <button
          onClick={addToCart}
          className="bg-green-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300"
        >
          Add to Cart
        </button>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-2 hover:bg-blue-600 transition duration-300">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductFetch;
