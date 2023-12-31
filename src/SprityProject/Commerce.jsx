import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FetchItemsInCart from '../ERichie/components/FetchItemsInCart';
import { ShoppingCart } from "lucide-react";

 

function ProductList() {

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [productsPerPage] = useState(8);

  const [showCases, setShowCases] = useState(false);

  const [cart, setCart] = useState([]);

  const [errorMessage] = useState('');
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)
  const  items = FetchItemsInCart();

 

  const apiUrl = 'https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products';

 

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await axios.get(apiUrl);

 

        if (response.status === 200) {

          const productData = response.data.documents.map((doc) => ({

            id: doc.name.split('/').pop(),

            productname: doc.fields.productname ? doc.fields.productname.stringValue : '',

            description: doc.fields.description ? doc.fields.description.stringValue : '',

            imageurl: doc.fields.imageurl ? doc.fields.imageurl.stringValue : '',

            stock: doc.fields.stock ? doc.fields.stock.integerValue : 0,

            type: doc.fields.type ? doc.fields.type.stringValue : '',

            shopid: doc.fields.shopid ? doc.fields.shopid.stringValue : '',

            category: doc.fields.category ? doc.fields.category.stringValue : '',

            quantity: 0,

          }));

          setProducts(productData);

        } else {

          console.error('Error fetching products. Response:', response);

        }

      } catch (error) {

        console.error('Error fetching products:', error);

      }

    };

 

    fetchProducts();

  }, [apiUrl]);

 

  const renderProductDescription = (product) => (

    <div className="product-popup">

      <p>{product.productname}</p>

      <Link to={`/shop10/product/${product.id}`}>

        <button style={{ fontWeight: 'bold' }}>View Details</button>

      </Link>

    </div>

  );

 

  const filteredProducts = products.filter((product) => {

    return (

      (!showCases || product.type.toLowerCase() === 'case') &&

      product.productname.toLowerCase().includes(searchTerm.toLowerCase())

    );

  });

 

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

 

  const isDisabled = (product) => {

    return parseInt(product.stock, 10) === 0;

  };

 

  const handlePageChange = (newPage) => {

    if (newPage >= 1 && newPage <= Math.ceil(filteredProducts.length / productsPerPage)) {

      setCurrentPage(newPage);

    }

  };
  const handleSignOut = () => {

    localStorage.removeItem("user");

    Navigate("/customer/login");

  };

 

  return (

    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">

      <div className="container mx-auto p-8">

      <Link to="/erichie/cart" className="flex items-center gap-2 hover:underline" style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <ShoppingCart />
        <p className="bg-white text-black rounded-full h-6 w-6 text-center">
          {itemsInCart}
        </p>
      </Link>
      <div className="flex justify-end space-x-4 mt-4">
      <Link to="/shop10/home">

        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center flex space-x-4 abolute top-0 right-0 mt-4 mr-4">Go Home</button>

      </Link>
      <button
          to="/shop10/admin/report"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center flex space-x-4 abolute top-0 right-0 mt-4 mr-4"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
        </div>
        <h1 className="text-3xl font-bold mb-4">SHOP YOUR WALLET OUT</h1>

        <input

          type="text"

          placeholder="Search by product name"

          value={searchTerm}

          onChange={(e) => setSearchTerm(e.target.value)}

          className="border border-blue-500 rounded-md py-2 px-4 mb-4 w-full"

        />

        <button

          onClick={() => setShowCases(!showCases)}

          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none ${

            showCases ? 'bg-gray-400 hover:bg-gray-500' : ''

          }`}

        >

          {showCases ? 'Show All' : 'Show Cases'}

        </button>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">

          {paginatedProducts.map((product) => {

            return (

              <div

                key={product.id}

                className={`bg-white rounded-lg shadow-md p-4 ${

                  isDisabled(product) ? 'opacity-60 pointer-events-none filter grayscale' : ''

                }`}

              >

                <img src={product.imageurl} alt={product.productname} className="w-40 h-42 object-cover mb-2 cursor-pointer" />

                {renderProductDescription(product)}

                <Link to={`/shop10/product/${product.id}`} className="invisible"></Link>

              </div>

            );

          })}

        </div>

        <div className="mt-6 flex items-center justify-center">

          <button

            onClick={() => handlePageChange(currentPage - 1)}

            disabled={currentPage === 1}

            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none mr-2 ${

              currentPage === 1 ? 'bg-gray-400 pointer-events-none' : ''

            }`}

          >

            Previous

          </button>

          <span className="text-lg font-bold mx-4">Page {currentPage}</span>

          <button

            onClick={() => handlePageChange(currentPage + 1)}

            disabled={endIndex >= filteredProducts.length}

            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none ml-2 ${

              endIndex >= filteredProducts.length ? 'bg-gray-400 pointer-events-none' : ''

            }`}

          >

            Next

          </button>

        </div>

      </div>

    </div>

  );

}

 

export default ProductList;