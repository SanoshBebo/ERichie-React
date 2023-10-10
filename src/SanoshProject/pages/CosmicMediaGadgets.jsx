import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShopOneProducts } from "../redux/shopOneProductSlice";
import { fetchProducts } from "../api/ApiCalls";

const CosmicMediaGadgets = () => {
  const products = useSelector((state) => state.shoponeproduct.shoponeproducts);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products based on the search query
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts()
      .then((productsData) => {
        dispatch(setShopOneProducts(productsData));
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  return (
    <div className="flex-row min-h-screen">
      <div className="header flex items-center justify-between p-10 px-20">
        <h2 className="font-bold text-2xl">Products</h2>
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
          {(searchQuery ? filteredProducts : products).map((product, index) => (
            <li
              key={index}
              className={`w-full p-2 ${
                product.stock == 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Link
                to={`/shop01/product/${product.productid}`}
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
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CosmicMediaGadgets;
