// useCart.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

function FetchItemsInCart() {
  const [itemsInCart, setItemsInCart] = useState(0);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const reduxState = useSelector((state) => state.shoponecart.items);
  const isCartUpdated = useSelector((state) => state.shoponecart.isCartUpdated);
  const dispatch = useDispatch();

  const baseUrl =
    "https://firestore.googleapis.com/v1/projects/erichieplatform/databases/(default)/documents";
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setIsUserSignedIn(true);
      const loggedInEmail = userData.email;

      const fetchCartItems = async () => {
        const cartApiUrl = `${baseUrl}/Carts`; // Replace with your actual URL
        try {
          const cartResponse = await axios.get(cartApiUrl);
          if (cartResponse.status === 200) {
            const cartResponseData = cartResponse.data;

            if (cartResponseData.documents) {
              const cartDocuments = cartResponseData.documents;
              const cartData = cartDocuments
                .filter((document) => {
                  const { email } = document.fields;
                  return email.stringValue === loggedInEmail;
                })
                .map((document) => {
                  return {
                    quantity: document.fields.quantity.integerValue,
                  };
                });

              const totalQuantity = cartData.reduce((acc, item) => {
                return acc + parseInt(item.quantity, 10);
              }, 0);
              setItemsInCart((prev) => totalQuantity);
            } else {
              console.log("No cart documents found in the collection.");
            }
          } else {
            console.error("Error fetching cart data:", cartResponse.statusText);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchCartItems();
    }
  }, [dispatch, reduxState, isCartUpdated]); // Added 'itemsInCart' as a dependency to refetch when items change

  return { itemsInCart };
}

export default FetchItemsInCart;
