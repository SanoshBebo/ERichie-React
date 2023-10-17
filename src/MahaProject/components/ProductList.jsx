import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products'
      )
      .then((response) => {
        const productsData = (response.data.documents || []).map((doc) => {
          const data = doc.fields || {};
          return {
            id: doc.name.split('/').pop(),
            productname: data.productname?.stringValue || '',
            description: data.description?.stringValue || '',
            price: data.price?.integerValue || 0,
            stock: data.stock?.integerValue || 0,
            imageurl: data.imageurl?.stringValue || '',
          };
        });
        setProducts(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Function to filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display a message when no search results are found
  const noResultsFound = filteredProducts.length === 0 && searchTerm !== '';

  // Calculate the start and end index of products to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <Link to="/mobiles" className="bg-purple-400 text-white py-1 px-2 rounded-lg mb-4 rounded full">
        Back to Mobile Category
      </Link>
      <Link to="/erichie" className="bg-purple-400 text-white py-1 px-2 rounded-lg mb-4 rounded full">
        Back to Erichie
      </Link>
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <div className="mb-4 flex items-center">
          <span role="img" aria-label="Search Icon" className="text-xl">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-2 py-1 w-full border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {noResultsFound ? (
          <p className="text-red-500 text-center font-semibold">No search results found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProducts.map((product) => (
              <Link
                to={`/shop12/product/${product.id}`}
                key={product.id}
                onClick={(e) => {
                  if (product.stock == 0) {
                    e.preventDefault(); // Prevent the link from being followed
                  }
                }}
              >
                <div
                  className={`product-card bg-white shadow-md rounded p-6 cursor-pointer ${
                    product.stock == 0 ? 'bg-grey' : ''
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2 text-center">{product.productname}</h3>
                  <p className="text-gray-700 text-center">Price: Rs.{product.price}</p>
                  <p className="text-gray-700 text-center">Stock: {product.stock}</p>
                  <img src={product.imageurl} alt={product.productname} className="max-h-48 mx-auto mt-4" />
                  {product.stock == 0 && (
                    <p className="text-red-500 text-center font-semibold">Out of Stock</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
