import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { setShopThreeProducts } from "../../SanoshProject/redux/shopThreeProductSlice"; // Updated import

import axios from "axios";
import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart } from "../../SanoshProject/redux/shopOneCartSlice";
import { addCartToFirestore } from "../../Api/CartOperationsFirestore";
import { toast } from "react-toastify";

const ProductPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [Loading, setLoading] = useState(false);
  const { id } = useParams();

  const [count, setCount] = useState(1); // Start with 1 item

  const products = useSelector(
    (state) => state.shopthreeproduct.shopthreeproducts
  );

  const product = products.find((product) => product.productid === id);

  const [manualQuantity, setManualQuantity] = useState("1"); // For manual quantity input

  useEffect(() => {
    async function fetchProducts() {
      try {
        const baseUrl =
          "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

        const collectionName = "Products";

        const apiUrl = `${baseUrl}/${collectionName}`;

        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        const responseData = response.data; // Use response.data to access the JSON data

        if (responseData.documents) {
          const productDocuments = responseData.documents;

          const productsData = productDocuments.map((document) => {
            const documentNameParts = document.name.split("/");

            const documentId = documentNameParts[documentNameParts.length - 1];

            const { description, stock, price, productname, shopid } =
              document.fields;

            return {
              description: description.stringValue,

              stock: stock.integerValue,

              price: price.integerValue,

              productname: productname.stringValue,

              productid: documentId,

              imageurl: document.fields.imageurl.stringValue,

              shopid: shopid.stringValue,
            };
          });

          // Dispatch the action to set products in the Redux store

          dispatch(setShopThreeProducts(productsData));

          // Data is loaded, set loading to false

          setLoading(false);
        } else {
          console.log("No documents found in the collection.");

          // Data is not loaded, set loading to false

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        // Data is not loaded, set loading to false

        setLoading(false);
      }
    }

    // Call the fetchProducts function when the component mounts

    fetchProducts();
  }, [dispatch]);

  const addQuantity = () => {
    if (count < product.stock) {
      setCount((prevCount) => prevCount + 1);

      setManualQuantity((prevValue) => (parseInt(prevValue) + 1).toString());
    }
  };

  const minusQuantity = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);

      setManualQuantity((prevValue) => (parseInt(prevValue) - 1).toString());
    }
  };

  const handleManualQuantityChange = (event) => {
    const inputValue = event.target.value;

    if (
      inputValue === "" ||
      (/^[0-9]*$/.test(inputValue) && parseInt(inputValue) <= product.stock)
    ) {
      setManualQuantity(inputValue);

      setCount(parseInt(inputValue) || 1); // Set a default value of 1 if input is empty
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
        shopid: product.shopid,
        price: product.price,
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
  };

  if (!product) {
    return <div>No product found with ID {id}</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex gap-4 bg-white rounded-lg shadow-md p-4">
        <img
          src={product.imageurl}
          alt={product.name}
          className="h-40 w-40 object-cover rounded-lg"
        />

        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">{product.productname}</h2>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-lg font-semibold text-green-500">
            Rs.{product.price}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              onClick={minusQuantity}
              disabled={count === 1}
            >
              -
            </button>

            <input
              type="text"
              value={manualQuantity}
              onChange={handleManualQuantityChange}
              className="w-12 text-center border border-gray-300 rounded"
            />

            <button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              onClick={addQuantity}
              disabled={count === product.stock}
            >
              +
            </button>
          </div>

          <div className="flex gap-5">
            <button
              className="bg-black text-white p-2 mt-4 rounded-lg hover:bg-gray-900 transition"
              onClick={addToCart}
              disabled={count > product.stock || count < 1}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
