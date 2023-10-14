import React, { useState, useEffect } from "react";
import { fetchShop09 } from "../Api/fetchShop09";
import { fetchShop10 } from "../Api/fetchShop10";
import { fetchShop11 } from "../Api/fetchShop11";
import { fetchShop12 } from "../Api/fetchShop12";
import { Link } from "react-router-dom";

const MobileCategory = () => {
  const [mobileProducts, setMobileProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const shopNineResponse = await fetchShop09();
        const shopTenResponse = await fetchShop10();
        const shopElevenResponse = await fetchShop11();
        const shopTwelveResponse = await fetchShop12();

        const allProducts = [
          ...shopNineResponse,
          ...shopTenResponse,
          ...shopElevenResponse,
          ...shopTwelveResponse,
        ];

        setMobileProducts(allProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const filteredProducts = mobileProducts.filter(
    (product) =>
      product.productname &&
      product.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {loading ? (
        <div className="loading-message">
          <p className="text-bold text-center text-3xl ">
            The phones and friends are getting ready to meet you.
          </p>
        </div>
      ) : (
        <div className="ProductList pb-5">
          <ul className="grid grid-cols-4 gap-6 place-items-center">
            {filteredProducts.map((product, index) => (
              <li
                key={index}
                className={`w-full p-2 ${
                  product.stock == 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Link
                  to={`/${product.shopid}/product/${product.productid}`}
                  className={`flex flex-col items-center gap-2 ${
                    product.stock == 0 ? "text-gray-500" : ""
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
                          Only {product.stock} left. Hurry up!
                        </p>
                      </div>
                    )}

                    {product.stock == 0 && (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-black bg-opacity-50">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <h1 className="text-center font-bold text-lg">
                    {product.productname || product.title}
                  </h1>
                  <p className="text-center font-serif">
                    Price: Rs.{product.price}
                  </p>
                  <p className="text-center">Store: {product.shopid}</p>
                  <p className="text-center font-bold">
                    Available: {product.stock}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileCategory;
