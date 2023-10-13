import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";

import { fetchProducts } from "../api/ApiCalls";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { setShopOneProducts } from "../../SanoshProject/redux/shopOneProductSlice";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const products = useSelector((state) => state.shoponeproduct.shoponeproducts);
  const product = products.find((product) => product.productid === id);
  const [dataLoaded, setDataLoaded] = useState(false); // Track whether data has been loaded
  const cartItems = useSelector((state) => state.shoponecart.items);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const url = `/shop01/product/${id}`;
  let redirectUrl = {
    url: url,
  };

  useEffect(() => {
    fetchProducts()
      .then((productsData) => {
        dispatch(setShopOneProducts(productsData));
        setDataLoaded(true); // Mark data as loaded
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      console.log(hallalujah);
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  if (!product && !dataLoaded) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <h2>Product Not Found</h2>
        <p>The product with ID {id} was not found.</p>
      </div>
    );
  }

  const addQuantity = () => {
    if (count < product.stock) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const minusQuantity = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const addToCart = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
      console.log(product);
      const cartItem = {
        id: product.productid,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        price: product.price,
        shopid: product.shopid,
        imageurl: product.imageurl,
        quantity: count,
      };
      dispatch(addItemToCart(cartItem));
      addCartToFirestore(cartItem, userData.email);

      toast.success("added to cart", {
        position: "top-right",
        autoClose: 200,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      localStorage.setItem("redirectUrl", JSON.stringify(redirectUrl));
      navigate("/customer/login");
    }
    setIsLoadingUser(false);

    // Create an object with the product details and count
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row w-full md:w-3/4">
        <div className="p-5 h-50 w-full md:w-1/3 mt-5 md:mt-0">
          <img
            src={product.imageurl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 p-4 mt-5">
          <h2 className="text-2xl font-semibold p-3">{product.productname}</h2>
          <p className="text-gray-600 text-lg pl-3">{product.description}</p>
          <p className="text-xl mt-2 pl-3">${product.price}</p>
          <div className="flex items-center mt-4">
            <button
              className="bg-gray-200 text-gray-600 px-3 py-2 rounded-md"
              onClick={minusQuantity}
              disabled={count === 0}
            >
              -
            </button>
            <span className="mx-3 text-xl">{count}</span>
            <button
              className="bg-gray-200 text-gray-600 px-3 py-2 rounded-md"
              onClick={addQuantity}
              disabled={count === product.stock}
            >
              +
            </button>
          </div>
          <Button
            className="mt-4 bg-blue-600 text-white hover:bg-gray-900"
            onClick={() => {
              addToCart();
            }}
            disabled={count === 0}
          >
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
