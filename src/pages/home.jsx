// // import React from 'react';
// // import { Link } from 'react-router-dom';

// // function HomePage() {
// //   return (
// //     <div className="home-page">
// //       <h1>Welcome to Our Shop</h1>

// //       {/* Search Bar */}

// //       <div className="search-bar">

// //         <input type="text" placeholder="Search products..." />

// //         <button>Search</button>

// //       </div>

// //       {/* Shop Blocks */}

// //       <div className="shop-blocks">

// //         <Link to="/shop17" className="shop-link">

// //           <div className="shop-block">

// //             <h2>Shop 1</h2>

// //             {/* Add other details or images */}

// //           </div>

// //         </Link>

// //         <Link to="/shop15" className="shop-link">

// //           <div className="shop-block">

// //             <h2>Shop 2</h2>

// //             {/* Add other details or images */}

// //           </div>

// //         </Link>
// //         <Link to="/shop14" className="shop-link">

// //           <div className="shop-block">

// //             <h2>Shop 3</h2>

// //             {/* Add other details or images */}

// //           </div>

// //         </Link>
// //         <Link to="/shop16" className="shop-link">

// //           <div className="shop-block">

// //             <h2>Shop 4</h2>

// //             {/* Add other details or images */}

// //           </div>

// //         </Link>
// //         <Link to="/shop13" className="shop-link">

// //           <div className="shop-block">

// //             <h2>Shop 5</h2>

// //             {/* Add other details or images */}

// //           </div>

// //         </Link>

// //         {/* Repeat for Shop 3, Shop 4, and Shop 5 */}

// //       </div>

// //     </div>

// //   );

// // }

// // export default HomePage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
import "./Home.css";
import loadingImage from './loading.gif'; 

let linkToRender = null;
const productsPerPage = 15;

const ComputerTeamHomePage = () => {
  async function fetchItems(url) {
    try {
      const response = await axios.get(url);

      const itemList = response.data.documents.map((doc) => ({
        id: doc.name.split("/").pop(), // Extract the document ID
        productname: doc.fields.productname.stringValue || "",
        price: doc.fields.price.integerValue || 0,
        imageurl: doc.fields.imageurl.stringValue || "",
        category: doc.fields.category.stringValue || "",
        description: doc.fields.description.stringValue || "",
        stock: doc.fields.stock.integerValue || 0,
        shopid: doc.fields.shopid.stringValue || "",
      }));
      const filteredItemList = itemList;

      return filteredItemList.map((item) => ({
        id: item.id,
        productname: item.productname,
        price: item.price,
        imageurl: item.imageurl,
        category: item.category,
        description: item.description,
        stock: item.stock,
        shopid: item.shopid,
      }));
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  }
  // const [displayedProducts, setDisplayedProducts] = useState([]);
  const [shop13, setShop13] = useState([]);
  const [shop14, setShop14] = useState([]);
  const [shop15, setShop15] = useState([]);
  const [shop16, setShop16] = useState([]);
  const [shop17, setShop17] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [allshops, setAllShops] = useState([]);

  const [search, setSearch] = useState();
  const [issearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [displayedProducts, setDisplayedProducts] = useState([]);



  useEffect(() => {
    import("./productpage.css");

    const fetchData = async () => {
      const item2 = await fetchItems(
        "https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products"
      );
      setShop14(item2);
      const item3 = await fetchItems(
        "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products"
      );
      setShop15(item3);
      const item4 = await fetchItems(
        "https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products"
      );
      setShop16(item4);
      const item5 = await fetchItems(
        "https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products"
      );
      setShop17(item5);
      const item1 = await fetchItems(
        "https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products"
      );
      setShop13(item1);

      const fetcharray = [...item3, ...item1, ...item2, ...item4, ...item5];
      setAllShops(fetcharray);
      setDisplayedProducts(fetcharray);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const searchproduct = () => {
    if (!search || search.trim() === "") {
      alert("Please enter a search term");
      setDisplayedProducts(allshops);
      setAllShops(allshops);
      return;
    }
    setIsSearch(true);
    const searchTerm = search;
    const filteredProducts = allshops.filter((product) =>
      product.productname.toLowerCase().includes(searchTerm)
    );

    setDisplayedProducts(filteredProducts);
    setAllShops(filteredProducts);
  };

  const Linkcheck = (product) => {
    // Initialize the link variable

    // Check the conditions and set the link based on each condition
    if (product.shopid === "shop13") {
      linkToRender = `/shop13/shop/${product.id}`;
    } else if (product.shopid === "shop14") {
      linkToRender = `/shop14/products/${product.id}`;
    } else if (product.shopid === "shop15") {
      linkToRender = `/checkout/${product.id}`;
    } else if (product.shopid === "shop16") {
      linkToRender = `/shop4products/${product.id}`;
    } else if (product.shopid === "shop17") {
      linkToRender = `/products/${product.id}`;
    }
  };


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allshops.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <div className="computer-home">
      <Header />
      <div className="computer-search_bar">
        <input
          type="text"
          value={search}
          placeholder="search"
          className="computer-search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchproduct} className="computer-search-button">
          search
        </button>    
        
        <Link to ="/erichie">
          <div className="computer-button"><button>E-Richie </button>
            </div>
        </Link>
      </div>

{isLoading ? ( // Display loading image when isLoading is true

        <div className='loading-container'>

          <img src={loadingImage} alt='Loading' />

        </div>

      ) : (
      <div className="productpage">
        <div className="shop">
          <div className="container">
            <div className="right_box">
              <div className="product_box">
                <div className="product_container">
                  
                  {currentProducts.map((curElm) => {
                    Linkcheck(curElm);
                    return (
                      <>
                        <Link to={linkToRender} key={curElm.id}>
                          <div className="box" key={curElm.id}>
                            <div className="img_box">
                              <img src={curElm.imageurl} alt="shopimage" />
                              <div className="icon"></div>
                            </div>
                            <div className="detail">
                              <h3>{curElm.productname}</h3>
                              <p>Rs. {curElm.price}</p>
                              <p>stock:{curElm.stock}</p>
                            </div>
                          </div>
                        </Link>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pagination">
            <ul className="pagination-list">
              {Array.from(
                { length: Math.ceil(allshops.length / productsPerPage) },
                (_, index) => (
                  <li
                    key={index}
                    className={`pagination-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="pagination-button"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
      </div>
      )}
      <div>
        
      <Link to ="/shop13">
          <div className="computer-button1"><button>Abhiram-Store </button>
            </div>
        </Link>
        <Link to ="/shop14">
          <div className="computer-button2"><button>Digital Genie </button>
            </div>
        </Link>
        <Link to ="/homepage">
          <div className="computer-button3"><button>Sanjay Computers </button>
            </div>
        </Link>
        <Link to ="/shop16/user">
          <div className="computer-button4"><button>Dhanu Computers </button>
            </div>
        </Link>
        <Link to ="/shop17">
          <div className="computer-button5"><button>Mr.Computer Wizz  </button>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default ComputerTeamHomePage;

// import React, { useEffect, useState } from 'react';

// import { Link } from 'react-router-dom';

// import axios from 'axios';

// import Header from '../pages/Header';

// import './Home.css';

// const Home = () => {

//   async function fetchItems(url) {

//     try {

//       const response = await axios.get(url);

//       const itemList = response.data.documents.map((doc) => ({

//         id: doc.name.split('/').pop(),

//         productname: doc.fields.productname.stringValue || '',

//         price: doc.fields.price.integerValue || 0,

//         imageurl: doc.fields.imageurl.stringValue || '',

//         category: doc.fields.category.stringValue || '',

//         description: doc.fields.description.stringValue || '',

//         stock: doc.fields.stock.integerValue || 0,

//         shopid: doc.fields.shopid.stringValue || '',

//       }));

//       const filteredItemList = itemList.filter((item) => item.stock > 0);

//       return filteredItemList;

//     } catch (error) {

//       console.error('Error fetching data: ', error);

//       return [];

//     }

//   }

//   const [allshops, setAllShops] = useState([]);

//   const [search, setSearch] = useState('');

//   const [currentPage, setCurrentPage] = useState(1);

//   const productsPerPage = 10;

//   useEffect(() => {

//     async function fetchData() {

//       try {

//         const item1 = await fetchItems("https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products");

//         const item2 = await fetchItems("https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products");

//         const item3 = await fetchItems("https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products");

//         const item4 = await fetchItems("https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products");

//         const item5 = await fetchItems("https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products");

//         const fetcharray = [...item1, ...item2, ...item3, ...item4, ...item5];

//         setAllShops(fetcharray);

//       } catch (error) {

//         console.error('Error fetching data: ', error);

//       }

//     }

//     fetchData();

//   }, []);

//   const handlePageChange = (page) => {

//     setCurrentPage(page);

//   };

//   const startIndex = (currentPage - 1) * productsPerPage;

//   const endIndex = startIndex + productsPerPage;

//   const displayedProducts = allshops.slice(startIndex, endIndex);

//   const searchproduct = () => {

//                     if (!search || search.trim() === '') {

//                           alert('Please enter a search term');

//                           setDisplayedProducts(allshops);

//                           return;

//                         }

//                         setIsSearch(true);

//                     const searchTerm = search;

//                     const filteredProducts = allshops.filter((product) =>

//                   product.productname.toLowerCase().includes(searchTerm)

//                 );

//                 setDisplayedProducts(filteredProducts);

//                   };

//   return (

//     <div className="home">

//       <Header />

//       <div className="search_bar">

//         <input

//           type="text"

//           value={search}

//           placeholder="Search"

//           className="search-input"

//           onChange={(e) => setSearch(e.target.value)}

//         />

//         <button onClick={searchproduct} className="search-button">

//           Search

//         </button>

//       </div>

//       <div className="productpage">

//         <div className="shop">

//           <div className="container">

//             <div className="right_box">

//               <div className="product_box">

//                 <div className="product_container">

//                   {displayedProducts.map((curElm) => (

//                     <Link to={`/product/${curElm.id}`} key={curElm.id} className="product-link">

//                       <div className="box">

//                         <div className="img_box">

//                           <img src={curElm.imageurl} alt={curElm.productname} />

//                           <div className="icon"></div>

//                         </div>

//                         <div className="detail">

//                           <h3>{curElm.productname}</h3>

//                           <p>${curElm.price}</p>

//                           <p>Stock: {curElm.stock}</p>

//                         </div>

//                       </div>

//                     </Link>

//                   ))}

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//       <div className="group-pagination">

//         {Array.from({ length: Math.ceil(allshops.length / productsPerPage) }).map((_, index) => (

//           <button

//             key={index}

//             onClick={() => handlePageChange(index + 1)}

//             className={currentPage === index + 1 ? 'active' : ''}

//           >

//             {index + 1}

//           </button>

//         ))}

//       </div>

//       <div className="shop-links">

//         <Link to="/shop13" className="shop-link">

//           <div className="shop-block">

//             <h2>Shop 13</h2>

//             {/* Add other details or images */}

//           </div>

//         </Link>

//         <Link to="/shop14" className="shop-link">

//           <div className="shop-block">

//             <h2>Shop 14</h2>

//             {/* Add other details or images */}

//           </div>

//         </Link>

//         <Link to="/homepage" className="shop-link">

//           <div className="shop-block">

//             <h2>Shop 15</h2>

//             {/* Add other details or images */}

//           </div>

//         </Link>

//         <Link to="/shop16" className="shop-link">

//           <div className="shop-block">

//             <h2>Shop 16</h2>

//             {/* Add other details or images */}

//           </div>

//         </Link>

//         <Link to="/shop17" className="shop-link">

//           <div className="shop-block">

//             <h2>Shop 17</h2>

//             {/* Add other details or images */}

//           </div>

//         </Link>

//       </div>

//     </div>

//   );

// };

// export default Home;
