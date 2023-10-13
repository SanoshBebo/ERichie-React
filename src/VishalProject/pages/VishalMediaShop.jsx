import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { setShopThreeProducts } from "../../SanoshProject/redux/shopThreeProductSlice";
import SearchInput from "../components/SearchInput";
import { fetchProducts } from "../API/ApiConnections";

const VishalMediaShop = () => {
  const dispatch = useDispatch();
  const shopthreeproducts = useSelector((state) => state.shopthreeproduct.shopthreeproducts);
  const [filteredProducts, setFilteredProducts] = useState(shopthreeproducts);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  
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
            const { description, stock, price, productname } = document.fields;
            return {
              description: description.stringValue,
              stock: stock.integerValue,
              price: price.integerValue,
              productname: productname.stringValue,
              productid: documentId,
              imageurl: document.fields.imageurl.stringValue,
            };
          });

          // Dispatch the action to set products in the Redux store
          dispatch(setShopThreeProducts(productsData));

          // Set filteredProducts using useState
          setFilteredProducts(productsData);
        } else {
          console.log("No documents found in the collection.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Call the fetchProducts function when the component mounts
    fetchProducts();
  }, [dispatch]);

  const handleSelectProduct = (productName) => {
    // Filter the products based on the selected product name
    const filtered = shopthreeproducts.filter((shopthreeproduct) =>
    shopthreeproduct.productname.toLowerCase().includes(productName.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Calculate the total number of pages based on the total number of products
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get the products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Function to handle pagination
  const handlePagination = (action) => {
    if (action === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (action === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-row h-screen">
      <div className="header flex items-center justify-between p-10 px-20 " style={{background:'white'}}>
        <h2 className="font-bold text-2xl">Our Products</h2>
        <SearchInput shopthreeproducts={shopthreeproducts} onSelectProduct={handleSelectProduct}/>
      </div>

      <div className="ProductList pb-5">
        <ul className="grid grid-cols-4 gap-6 place-items-center">
          {currentProducts.map((shopthreeproduct, index) => (
            <li key={index} className="w-full  p-2">
              <Link
                to={`/shop03/product/${shopthreeproduct.productid}`}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={shopthreeproduct.imageurl} // Use the image URL from Firestore
                  alt={shopthreeproduct.productname}
                  className=" bg-slate-500 object-cover"
                />
                <h1 className="text-center">{shopthreeproduct.productname}</h1>
                <p className="text-center">Price: Rs.{shopthreeproduct.price}</p>
                <p className="text-center">Stock: {shopthreeproduct.stock}</p>
              </Link>
            </li>
          ))}
        </ul>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
          <Button
            variant="primary"
            onClick={() => handlePagination("prev")}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="primary"
            onClick={() => handlePagination("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VishalMediaShop;
