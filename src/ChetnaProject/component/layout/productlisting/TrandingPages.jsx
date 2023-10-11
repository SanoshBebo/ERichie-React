import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TrandingPages = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of products per page

  useEffect(() => {
    // Fetch data from Firestore
    axios
      .get(
        "https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products"
      )
      .then((response) => {
        // Extract product data from the response
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          return {
            id: doc.name.split("/").pop(),
            productname: data.productname.stringValue,
            description: data.description.stringValue,
            price: data.price.integerValue,
            imageurl: data.imageurl.stringValue,
          };
        });
        // Set products state with the retrieved data
        setProducts(productsData);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-8">
        <div className="relative rounded-full bg-primary text-white px-4 py-2 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent text-white focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {currentProducts.map((product) => (
            <Link key={product.id} to={`/productlisting/${product.id}`}>
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 ease-in-out">
                <img src={product.imageurl} alt={product.productname} className="w-full h-40 object-cover mb-2" />
                <h2 className="text-lg font-semibold">{product.productname}</h2>
                <p className="text-gray-600">Price: ${product.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 mx-1 border rounded-full focus:outline-none ${
                currentPage === index + 1 ? 'bg-primary text-white' : 'text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrandingPages;
