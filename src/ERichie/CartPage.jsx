import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import {
  removeItemFromCart,
  setCartItems,
  updateCartItemQuantity,
} from "../SanoshProject/redux/shopOneCartSlice";

import {
  fetchCart,
  removeItemFromCartFirestore,
  updateCartFirestore,
} from "../Api/CartOperationsFirestore";

import { Trash2 } from "lucide-react";
import { storePurchaseInFirestore } from "../Api/Orders";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../Api/fetchAllProducts";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const CartComponent = () => {
  const cartItems = useSelector((state) => state.shoponecart.items);
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Calculate the total price when cart items change
    const newTotalPrice = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setTotalPrice(newTotalPrice);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if ((!isLoadingUser && user.length === 0) || user.role == "shopkeeper") {
      navigate("/customer/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData) {
        const allProductData = await fetchAllProducts();
        console.log(allProductData);
        setAllProducts(allProductData);
        const response = await fetchCart(userData.email, allProductData);
        dispatch(setCartItems(response));
        dispatch(setUser(userData));
        setIsDataLoaded(true);
      }
      setIsLoadingUser(false);
    };

    fetchCartAndProducts();
  }, []);

  const handleDelete = (id) => {
    dispatch(removeItemFromCart(id));
    removeItemFromCartFirestore(user.email, id);
  };

  const addQuantity = (id) => {
    const item = cartItems.find((item) => item.productid === id);
    console.log(item, id);
    const quantity = parseInt(item.quantity, 10);
    const stock = parseInt(item.stock, 10);
    if (item && quantity < stock) {
      const newQuantity = quantity + 1;
      dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
      updateCartFirestore(user.email, id, newQuantity);
    }
  };

  const minusQuantity = (id) => {
    const item = cartItems.find((item) => item.productid === id);
    const quantity = parseInt(item.quantity, 10);
    if (item && quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
      updateCartFirestore(user.email, id, newQuantity);
    }
  };

  const handlePurchase = async () => {
    await storePurchaseInFirestore(allProducts, cartItems, user.email);

    localStorage.removeItem("cart");

    await Promise.all(
      cartItems.map(async (item) => {
        await removeItemFromCartFirestore(user.email, item.productid);
      })
    );

    toast.success("Purchase Successful", {
      position: "top-right",
      autoClose: 200,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    fetchCart(user.useruid).then((response) => {
      dispatch(setCartItems(response));
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4">
      <div className="md:w-2/3 relative">
        <h2 className="font-bold text-2xl mb-4">Cart</h2>
        {isDataLoaded ? (
          <ul className="flex flex-col">
            {cartItems.length > 0 ? (
              cartItems.map((product, index) => (
                <li
                  key={index}
                  className="bg-slate-100 rounded-lg p-2 flex justify-between items-center mb-4"
                >
                  <div className="flex items-center p-3">
                    <div className="w-20 h-20">
                      <img
                        src={product.imageurl}
                        alt={product.productname}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-row p-4">
                      <h1 className="text-lg font-semibold">
                        {product.productname}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3">
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-gray-200 text-gray-600 px-3 py-2 rounded-md"
                        onClick={() => minusQuantity(product.productid)}
                      >
                        -
                      </button>
                      <span className="mx-3 text-xl">{product.quantity}</span>
                      <button
                        className="bg-gray-200 text-gray-600 px-3 py-2 rounded-md"
                        onClick={() => addQuantity(product.productid)}
                      >
                        +
                      </button>
                    </div>
                    <Trash2
                      className="cursor-pointer ml-4"
                      onClick={() => {
                        handleDelete(product.productid);
                      }}
                    />
                  </div>
                </li>
              ))
            ) : (
              <div>
                <h1 className="absolute">No Items Available In Cart</h1>
              </div>
            )}
          </ul>
        ) : (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="md:w-1/3 p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Total Price:</h3>
            <p className="text-xl">${totalPrice.toFixed(2)}</p>
          </div>
          <Button
            className="bg-black text-white p-4 w-full"
            onClick={handlePurchase}
          >
            Purchase
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
