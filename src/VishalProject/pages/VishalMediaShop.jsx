import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { setShopThreeProducts } from "../../SanoshProject/redux/shopThreeProductSlice";
import ReactPaginate from "react-paginate";

const VishalMediaShop = () => {
  const dispatch = useDispatch();
  const shopthreeproducts = useSelector(
    (state) => state.shopthreeproduct.shopthreeproducts
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Page number starts from 0
  const [itemsPerPage] = useState(12); // Number of items to display per page
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(0); // Reset to the first page when searching

    // Filter products based on the search query
    const filtered = shopthreeproducts.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  const currentProducts = searchQuery ? filteredProducts : shopthreeproducts;

  // Calculate the index of the first and last item on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = currentProducts.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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

  return (
    <div className="flex-row h-screen">
      <div
        className="header flex items-center justify-between p-10 px-20 "
        style={{ background: "white" }}
      >
        <h2 className="font-bold text-2xl">Our Products</h2>
        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 border rounded-md w-25"
        />
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
                <p className="text-center">
                  Price: Rs.{shopthreeproduct.price}
                </p>
                <p className="text-center">Stock: {shopthreeproduct.stock}</p>
              </Link>
            </li>
          ))}
        </ul>
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination p-10"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            previousClassName={"pagination-button"}
            nextClassName={"pagination-button"}
            pageClassName={"pagination-button"}
            pageLinkClassName={"pagination-link"}
          />
        )}
      </div>
    </div>
  );
};

export default VishalMediaShop;
