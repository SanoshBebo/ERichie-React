import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(8);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(0);

    const filtered = shopthreeproducts.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  const currentProducts = searchQuery ? filteredProducts : shopthreeproducts;

  const offset = currentPage * itemsPerPage;
  const currentItems = currentProducts.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const baseUrl = "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";
        const collectionName = "Products";
        const apiUrl = `${baseUrl}/${collectionName}`;
        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        const responseData = response.data;

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

          dispatch(setShopThreeProducts(productsData));
          setFilteredProducts(productsData);
        } else {
          console.log("No documents found in the collection.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="flex-row h-screen">
      <div
        className="header flex items-center justify-between p-10 px-20"
       
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

      <div className="ProductList pb-5 px-10">
        <ul className="grid grid-cols-4 gap-6 place-items-center">
          {currentItems.map((shopthreeproduct, index) => (
            <li key={index} className="w-full  p-2 transform hover:scale-105 transition duration-300">
              <Link to={`/shop03/product/${shopthreeproduct.productid}`} className="flex flex-col items-center gap-2">
                <img src={shopthreeproduct.imageurl} alt={shopthreeproduct.productname} className="bg-slate-500 object-cover rounded-lg" />
                <h1 className="text-center text-xl font-semibold">{shopthreeproduct.productname}</h1>
                <p className="text-center">Price: Rs.{shopthreeproduct.price}</p>
                <p className="text-center">Stock: {shopthreeproduct.stock}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {pageCount > 1 && (
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
};

export default VishalMediaShop;
