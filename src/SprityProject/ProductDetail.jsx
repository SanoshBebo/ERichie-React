import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [confirmationDisplayed, setConfirmationDisplayed] = useState(false);
  const { productId } = useParams();
  const [stock, setStock] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products/${productId}`
        );
        if (response.status === 200) {
          const productData = response.data;
          setProduct(productData);
          setStock(productData.fields.stock.integerValue);
        } else {
          console.error('Error fetching product. Response:', response);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  const productname = product.fields.productname.stringValue;
  const description = product.fields.description.stringValue;
  const imageUrl = product.fields.imageurl ? product.fields.imageurl.stringValue : '';

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 0) {
      return; // Prevent negative quantities
    }
    if (newQuantity > stock) {
      const confirmMessage = `Unfortunately, we do not have ${newQuantity} in stock for ${productname}. Do you want to proceed anyway?`;
      if (!confirmationDisplayed && window.confirm(confirmMessage)) {
        setConfirmationDisplayed(true);
      }
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg p-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          onClick={handleGoBack}
        >
          Back
        </button>
        <h1 className="text-3xl font-semibold mt-4">{productname}</h1>
        <div className="flex items-center mt-4">
          <img src={imageUrl} alt={productname} className="w-100 h-500  mr-4" />
          <p className="text-gray-700 justify-center">{description}</p>
        </div>
        <div className="flex items-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full mr-2"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
          <span className="text-xl">{quantity}</span>
          <button
            className={`${
              quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-full ml-2`}
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 0}
          >
            -
          </button>
        </div>
        <div className="mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
