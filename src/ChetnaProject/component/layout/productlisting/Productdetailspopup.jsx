import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details based on the id parameter
    axios
      .get(`https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${id}`)
      .then((response) => {
        const data = response.data.fields;
        const productData = {
          id: id,
          productname: data.productname.stringValue,
          description: data.description.stringValue,
          price: data.price.integerValue,
          imageurl: data.imageurl.stringValue,
        };
        // Set product state with the retrieved data
        setProduct(productData);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  const addToCart = () => {
    // Implement logic to add the product to the cart
    console.log("Product added to cart:", product);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-4 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <h1 className="text-2xl font-semibold mb-4">{product.productname}</h1>
        <p className="text-xl font-medium mb-4">Price: ${product.price}</p>
        <p className="text-gray-600 mb-4">Description: {product.description}</p>
        <img src={product.imageurl} alt={product.productname} className="w-full max-w-md mx-auto mb-4" />
        <div className="flex justify-center space-x-4">
          <button
            onClick={addToCart}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Add to Cart
          </button>
          <Link to="/protectlist">
            <button
              className="bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg"
            >
              Back to Product List
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
