import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { setShopThreeProducts } from "../../SanoshProject/redux/shopThreeProductSlice";
import SearchInput from "../components/SearchInput";
import { fetchProducts } from "../API/ApiConnections";

const VishalMediaShop = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.shopthreeproduct.shopthreeproducts);
  const [filteredProducts, setFilteredProducts] = useState(products);
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

  const handleSelectProduct = (productName) => {
    // Filter the products based on the selected product name
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(productName.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="flex-row h-screen">
      <div className="header flex items-center justify-between p-10 px-20">
        <h2 className="font-bold text-2xl">Our Products</h2>
        <SearchInput
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      </div>

      <div className="ProductList pb-5">
        <ul className="grid grid-cols-4 gap-6 place-items-center">
          {products.map((product, index) => (
            
            <li key={index} className="w-full  p-2">
              <Link
                to={`/shop03/product/${product.productid}`}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={product.imageurl} // Use the image URL from Firestore
                  alt={product.productname}
                  className=" bg-slate-500 object-cover"
                />
                <h1 className="text-center">{product.productname}</h1>
                <p className="text-center">Price: ${product.price}</p>
                <p className="text-center">Stock: {product.stock}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VishalMediaShop;
