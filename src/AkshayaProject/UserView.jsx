// import React, { useState, useEffect } from "react";

// import axios from "axios";

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useNavigate,
// } from "react-router-dom";

// import ProductDetails from "./ProductDetails";

// import "tailwindcss/tailwind.css";
// import video from "./header.mp4"

// const UserView = () => {
//   const [products, setProducts] = useState([]);

//   const [cart, setCart] = useState([]);

//   const [searchInput, setSearchInput] = useState("");

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [quantity, setQuantity] = useState(1);

//   const [currentPage, setCurrentPage] = useState(1);

//   const productsPerPage = 3;

//   const navigate = useNavigate(); // Use navigate hook to programmatically navigate

//   useEffect(() => {
//     // Fetch products from Firestore

//     const firestoreApiKey = "AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U";

//     const firestoreProjectId = "e-ritchie";

//     const firestoreCollection = "Products";

//     axios

//       .get(
//         `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}?key=${firestoreApiKey}`
//       )

//       .then((response) => {
//         const fetchedProducts = response.data.documents.map((doc) => {
//           const productData = doc.fields;

//           const name =
//             productData.productname?.stringValue || "Unknown Product";

//           const description =
//             productData.description?.stringValue || "No description available";

//           const price = productData.price?.integerValue || 0;

//           const stock = productData.stock?.integerValue || 0;

//           const category = productData.category?.stringValue || "Uncategorized";

//           const shopname = productData.shopname?.stringValue || "Unknown Shop";

//           const imageurl = productData.imageurl?.stringValue || "";

//           return {
//             id: doc.name.split("/").pop(),

//             name,

//             description,

//             price,

//             stock,

//             category,

//             shopname,

//             imageurl,
//           };
//         });

//         setProducts(fetchedProducts);
//       })

//       .catch((error) => {
//         console.error("Error fetching products", error);
//       });
//   }, []);

//   const handleProductClick = (product) => {
//     setSelectedProduct(product);

//     setQuantity(1);

//     // Use navigate to go to the product details page

//     navigate(`/product/${product.id}`);
//   };

//   const handleAddToCart = () => {
//     if (!selectedProduct) return;

//     // Implement add to cart logic
//   };

//   const handleBuyNow = () => {
//     if (!selectedProduct) return;

//     // Implement buy now logic
//   };

//   const handleSignOut = () => {

//     localStorage.removeItem("user");

//     navigate("/customer/login");

//   };

//   const filteredProducts = products.filter((product) => {
//     return product.name.toLowerCase().includes(searchInput.toLowerCase());
//   });
//   const indexOfLastProduct = currentPage * productsPerPage;

//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   return (
//     <div>

//       <header className="bg-gray-200 py-4 text-center">
//         <h1 className="text-4xl font-bold">E-NERD</h1>
//         <ul className="flex justify-end space-x-8 text-center absolute top-3 right-0 mt-4 mr-4">

//           <li className="cursor-pointer ">

//             <Link to="/erichie/cart">🛒</Link>

//           </li>

//           <li className="cursor-pointer hover:underline">

//             <Link to="/mediacategories">MediaProducts</Link>

//           </li>

//           <li className="cursor-pointer hover:underline">

//             <Link to="/erichie">MainPage</Link>

//           </li>

//           <li

//             className="cursor-pointer hover:underline"

//             onClick={handleSignOut}

//           >

//             SignOut

//           </li>

//         </ul>
//       </header>
//       <div className="absolute top-12 right-12">
//         {" "}
//         {/* Adjust spacing using Tailwind classes */}
//         {/* <Link
//           to="/MediaCategories"
//           button
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Back
//         </Link> */}
//       </div>

//       <div className="video-container">

// <video autoPlay loop muted className="fullscreen-video">

//   <source src={video} type="video/mp4" />

//   Your browser does not support the video tag.

// </video>

// </div>
//       <div className="flex-row justify-center items-center text-center bg-zinc-700">
//       <div className="user-view-container">
//           <div className="p-4">
//             <input
//               type="text"
//               placeholder="Search by product name"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               className="w-full border rounded py-3 px-2"
//             />
//           </div>
//         <h2 className="user-view-heading font-bold text-4xl p-5">
//           Products
//         </h2>

//         </div>
//         <ul className="product-list">
//           {currentProducts.map((product) => (
//            <li key={product.id} className="product-item hover:shadow-lg rounded-lg overflow-hidden">
//               <Link
//                 to={`/shop02/product/${product.id}`}
//                 onClick={() => handleProductClick(product)}
//               >
//                 <img
//                   src={product.imageurl}
//                   alt={product.name}
//                   className="product-image"
//                 />

//                 <div className="product-details">

//                   <h1>{product.name}</h1>
//                   <br />

//                   <h1>
//                     {product.description}
//                   </h1>
//                   <br />
//                   <p>
//                   Rs.{product.price}
//                   </p>

//                   <p>
//                     {/* Stock: {product.stock}, Category: {product.category}, Shop:{" "}
//                     {product.shopname} */}
//                   </p>
//                 </div>
//               </Link>
//             </li>
//           ))}
//         </ul>
//         <div className="flex justify-center my-4">
//           <ul className="flex">
//             {Array.from({
//               length: Math.ceil(filteredProducts.length / productsPerPage),
//             }).map((_, index) => (
//               <li key={index} className="mx-2">
//                 <button
//                   className={`py-2 px-4 rounded ${
//                     currentPage === index + 1
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200"
//                   }`}
//                   onClick={() => setCurrentPage(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <Routes>
//         <Route
//           path="/shop02/product/:productId"
//           element={
//             <ProductDetails
//               onAddToCart={handleAddToCart}
//               onBuyNow={handleBuyNow}
//             />
//           }
//         />
//       </Routes>
//     </div>
//   );
// };

// export default UserView;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import ProductDetails from "./ProductDetails";
import video from "./header.mp4";

const UserView = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from Firestore
    const firestoreApiKey = "AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U";

    const firestoreProjectId = "e-ritchie";

    const firestoreCollection = "Products";

    axios
      .get(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}?key=${firestoreApiKey}`
      )
      .then((response) => {
        const fetchedProducts = response.data.documents.map((doc) => {
          const productData = doc.fields;

          const name =
            productData.productname?.stringValue || "Unknown Product";

          const description =
            productData.description?.stringValue || "No description available";

          const price = productData.price?.integerValue || 0;

          const stock = productData.stock?.integerValue || 0;

          const category = productData.category?.stringValue || "Uncategorized";

          const shopname = productData.shopname?.stringValue || "Unknown Shop";

          const imageurl = productData.imageurl?.stringValue || "";

          return {
            id: doc.name.split("/").pop(),

            name,

            description,

            price,

            stock,

            category,

            shopname,

            imageurl,
          };
        });

        setProducts(fetchedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // Implement add to cart logic
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    // Implement buy now logic
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");

    navigate("/customer/login");
  };

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchInput.toLowerCase());
  });
  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div>
      <header className="bg-gray-200 py-4 text-center">
        <h1 className="text-4xl font-bold">E-NERD</h1>
        <ul className="flex justify-end space-x-8 text-center absolute top-3 right-0 mt-4 mr-4">
          <li className="cursor-pointer">
            <Link to="/erichie/cart">🛒</Link>
          </li>
          <li className="cursor-pointer hover:underline">
            <Link to="/mediacategories">MediaProducts</Link>
          </li>
          <li className="cursor-pointer hover:underline">
            <Link to="/erichie">MainPage</Link>
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={handleSignOut}
          >
            SignOut
          </li>
        </ul>
      </header>

      <div className="absolute top-12 right-12"></div>

      <div className="video-container">
        <video autoPlay loop muted className="fullscreen-video">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex-row justify-center items-center text-center bg-zinc-700">
        <br />
        <div className="user-view-container max-w-3xl mx-auto p-4">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border rounded py-3 px-2"
          />
          <h2 className="user-view-heading font-bold text-4xl p-5 text-white">
            Products
          </h2>
        </div>

        <ul className="product-list flex flex-wrap justify-center">
          {currentProducts.map((product) => (
            <li
              key={product.id}
              className="product-item bg-white hover:shadow-lg rounded-lg overflow-hidden border p-15 m-10 w-64"
            >
              <Link
                to={`/shop02/product/${product.id}`}
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.imageurl}
                  alt={product.name}
                  className="product-image w-full"
                />
                <div className="product-details text-center  mt-2">
                  <h1 className="text-xl font-bold">{product.name}</h1>
                  <br />
                  <h1>{product.description}</h1>
                  <br />
                  <p>Rs.{product.price}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-center my-4">
          <ul className="flex">
            {Array.from({
              length: Math.ceil(filteredProducts.length / productsPerPage),
            }).map((_, index) => (
              <li key={index} className="mx-2">
                <button
                  className={`py-2 px-4 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Routes>
        <Route
          path="/shop02/product/:productId"
          element={
            <ProductDetails
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default UserView;
