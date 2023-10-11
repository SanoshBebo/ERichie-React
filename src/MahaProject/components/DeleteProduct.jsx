import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteProduct = () => {
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // To store selected product data

  useEffect(() => {
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products'
      )
      .then((response) => {
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            productname: data.productname?.stringValue || '', // Check if field exists
            description: data.description?.stringValue || '', // Check if field exists
            price: data.price?.integerValue || 0, // Check if field exists
            imageUrl: data.imageUrl?.stringValue || '', // Check if field exists
            shopname: data.shopname?.stringValue || '', // Check if field exists
            shopid: data.shopid?.stringValue || '', // Check if field exists
            stock: data.stock?.integerValue || '',
          };
        });
        setProductList(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleProductChange = (e) => {
    const selectedProductName = e.target.value;
    setProductName(selectedProductName);
    setSelectedProductId(''); // Clear selectedProductId when product name changes
    setSelectedProduct(null); // Clear selected product data
  };

  const handleDelete = async () => {
    if (!selectedProductId) {
      alert('Please select a product to delete.');
      return;
    }

    try {
      // Send a delete request to Firestore
      await axios.delete(
        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${selectedProductId}`
      );

      alert('Product deleted successfully');
      // Clear selected product after deletion
      setSelectedProductId('');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Filter products with the same name
  const productsWithSameName = productList.filter(
    (productItem) => productItem.productname === productName
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Delete Product</h2>
        <div className="mb-4">
          <label className="block text-gray-600">Select a Product Name:</label>
          <select
            className="w-full p-2 border rounded"
            onChange={handleProductChange}
            value={productName}
          >
            <option value="">Select a product</option>
            {productList.map((productItem) => (
              <option key={productItem.id} value={productItem.productname}>
                {productItem.productname}
              </option>
            ))}
          </select>
        </div>
        {productsWithSameName.length > 0 && (
          <div>
            <label className="block text-gray-600">
              Select a Product to Delete:
            </label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                // Find and set selected product data
                const productData = productsWithSameName.find(
                  (productItem) => productItem.id === e.target.value
                );
                setSelectedProduct(productData);
              }}
              value={selectedProductId}
            >
              <option value="">Select a product to delete</option>
              {productsWithSameName.map((productItem) => (
                <option key={productItem.id} value={productItem.id}>
                  {productItem.description}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedProduct && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Product details:</h3>
            <div className="flex flex-col items-center">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.productname}
                className="max-w-md mt-2 mb-4 rounded-lg"
              />
              <ul className="text-left">
                <li>
                  <strong>Product Name:</strong> {selectedProduct.productname}
                </li>
                <li>
                  <strong>Description:</strong> {selectedProduct.description}
                </li>
                <li>
                  <strong>Price:</strong> {selectedProduct.price}
                </li>
                <li>
                  <strong>Shop Name:</strong> {selectedProduct.shopname}
                </li>
                <li>
                  <strong>Stock:</strong> {selectedProduct.stock}
                </li>
              </ul>
            </div>
          </div>
        )}
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleDelete}
        >
          Delete Product
        </button>
      </div>
    </div>
  );
};

export default DeleteProduct;
