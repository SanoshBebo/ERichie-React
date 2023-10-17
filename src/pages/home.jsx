import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
import "./Home.css";
import loadingImage from './loading.gif'; 
import loadingloader from './loading-loader.gif'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let linkToRender = null;
const productsPerPage = 15;

const ComputerTeamHomePage = () => {

const navigate = useNavigate();

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

  const [search, setSearch] = useState("");
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
      // alert("Please enter a search term");
      toast.warning('Please enter a search term!!', {
        position: 'top-right',
        autoClose: 3000, // Time in milliseconds to keep the toast open
      });

      setDisplayedProducts(allshops);
      setAllShops(allshops);
      setIsSearch(false);
      return;
    }
    else{
    const searchTerm = search.toLowerCase();;
    const filteredProducts = allshops.filter((product) =>
      product.productname.toLowerCase().includes(searchTerm)
      
    );

    setDisplayedProducts(filteredProducts);

    setIsSearch(true);

    }


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
  const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <div className="computer-home">
      <Header />
    <div className="computer-shop-box">
      <div className="individual-shop-header">
        
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
        
        
      </div>

{isLoading ? ( // Display loading image when isLoading is true

        <div className='loading-container'>

          {/* <img src={loadingImage} alt='Loading' /> */}
          <img src={loadingloader} alt='Loading' />

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
                { length: Math.ceil(displayedProducts.length / productsPerPage) },
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
      
    </div>
  );
};

export default ComputerTeamHomePage;
