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
            imageUrl: data.imageUrl?.stringValue || '',
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

  // Calculate the start and end index of products to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <Link to='/shop12/customer' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 inline-block">
        Back to Home
      </Link>
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <div className="mb-4 flex items-center">
          <span role="img" aria-label="Search Icon" className="text-xl">🔍</span>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-2 py-1 w-full border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProducts.map((product) => (
            <Link to={`/shop12/product/${product.id}`} key={product.id}>
              <div className="bg-white shadow-md rounded p-6 cursor-pointer">
                <h3 className="text-xl font-semibold mb-2">{product.productname}</h3>
                <p className="text-gray-700">Price: ${product.price}</p>
                <p className="text-gray-700">Stock: {product.stock}</p>
                <img src={product.imageUrl} alt={product.productname} className="max-h-48 mx-auto mt-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
          >
            Previous
          </button>
          <span className="mx-4 text-lg font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
