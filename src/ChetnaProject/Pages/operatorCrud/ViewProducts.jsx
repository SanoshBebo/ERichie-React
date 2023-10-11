import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4);

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

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  // Calculate indexes for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold mb-4">View Products</h1>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out"
              onClick={() => openModal(product)}
            >
              {/* Display product details */}
              <img
                src={product.imageurl}
                alt={product.productname}
                className="w-32 h-32 object-cover mx-auto mb-2"
              />
              <h2 className="text-lg font-semibold mb-2">{product.productname}</h2>
              <p>Price: ${product.price}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-primary-color text-white"
                  : "bg-white text-primary-color hover:bg-primary-color hover:text-white"
              } px-3 py-1 mx-1 rounded-lg focus:outline-none`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <span
                className="absolute top-2 right-2 cursor-pointer text-2xl"
                onClick={closeModal}
              >
                &times;
              </span>
              <img
                src={selectedProduct.imageurl}
                alt={selectedProduct.productname}
                className="w-48 h-48 object-cover mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{selectedProduct.productname}</h2>
              <p className="mb-4">{selectedProduct.description}</p>
              <p>Price: ${selectedProduct.price}</p>
              <button
                onClick={closeModal}
                className="bg-primary-color text-white px-4 py-2 mt-4 rounded-lg hover:bg-primary-color-dark"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
