import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";
import { addItemToCart, addNoOfItemsInCart } from "../../../SanoshProject/redux/shopOneCartSlice";
import { useDispatch } from "react-redux";
import { addCartToFirestore } from "../../../Api/CartOperationsFirestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ProductInfo() {
  const context = useContext(myContext);
  const { loading, setLoading } = context;
  const dispatch = useDispatch(); // You can use useDispatch here
  const navigate = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [products, setProducts] = useState("");
  const params = useParams();
  // console.log(products.title)

  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "Products", params.id));
      // console.log(productTemp)
      setProducts(productTemp.data());
      // console.log(productTemp.data())
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const addCart = (product) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role == "customer") {
      dispatch(setUser(userData));
      console.log(product)
      const cartItem = {
        id: params.id,
        name: product.productname,
        description: product.description,
        stock: product.stock,
        shopid: product.shopid,
        price: product.price,
        imageurl: product.imageUrl,
        quantity: 1,
      };
      dispatch(addItemToCart(cartItem));
      dispatch(addNoOfItemsInCart(1));

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

  // useEffect(() => {
  //     localStorage.setItem('cart', JSON.stringify(cartItems));
  // }, [cartItems])

  return (
    <Layout>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-10 mx-auto">
          {products && (
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <img
                alt="ecommerce"
                className="lg:w-1/3 w-full lg:h-auto  object-contain object-center rounded"
                src={products.imageUrl}
              />
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  PRODUCT INFO
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {products.productname}
                </h1>
                
                <p className="leading-relaxed border-b-2 mb-5 pb-5">
                  {products.description}
                </p>

                <div className="flex">
                  <span className="title-font font-medium text-2xl text-blue-900">
                    ₹{products.price}
                  </span>
                  <button
                    onClick={() => addCart(products)}
                    className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                    disabled={ products.stock == 0}
                  >
                    Add To Cart
                  </button>
               
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default ProductInfo;
