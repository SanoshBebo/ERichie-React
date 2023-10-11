import React, { useState, useEffect } from "react";
import { fetchShop09 } from "../Api/fetchShop09";
import { fetchShop10 } from "../Api/fetchShop10";
import { fetchShop11 } from "../Api/fetchShop11";
import { fetchShop12 } from "../Api/fetchShop12";
import { Link } from "react-router-dom";

const MobileCategory = () => {
  const [mobileProducts, setMobileProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Make API calls to fetch products from different endpoints
        const shopNineResponse = await fetchShop09();
        const shopTenResponse = await fetchShop10();
        const shopElevenResponse = await fetchShop11();
        const shopTwelveResponse = await fetchShop12();
        // Combine all products into a single array
        console.log(shopNineResponse);
        console.log(shopTenResponse);
        console.log(shopElevenResponse);
        console.log(shopTwelveResponse);
        const allProducts = [
          ...shopNineResponse,
          ...shopTenResponse,
          ...shopElevenResponse,
          ...shopTwelveResponse,
        ];

        // Update the state with the combined products
        setMobileProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Call the function to fetch products
    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products based on the search query
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex-row min-h-screen">
      <div className="header flex items-center justify-between p-10 px-20">
        <h2 className="font-bold text-2xl">Mobile Products</h2>
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
          {(searchQuery ? filteredProducts : mobileProducts).map(
            (product, index) => (
              <li
                key={index}
                className={`w-full p-2 ${
                  product.stock == 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Link
                  to={`/${product.shopid}/product/${product.productid}`}
                  className={`flex flex-col items-center gap-2 ${
                    product.stock == 0 ? "text-gray-500" : "" // You can adjust the text color as needed
                  }`}
                >
                  <div className="h-70 w-70 relative">
                    <img
                      src={product.imageurl}
                      alt={product.name}
                      className="bg-slate-500 object-cover w-full h-full"
                    />
                    {product.stock > 0 && product.stock <= 5 && (
                      <div className="w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50">
                        <p className="text-white">
                          Only {product.stock} left Hurry up!
                        </p>
                      </div>
                    )}

                    {product.stock == 0 && (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <h1 className="text-center">{product.productname}</h1>
                  <p className="text-center">Price: {product.price}</p>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileCategory;
