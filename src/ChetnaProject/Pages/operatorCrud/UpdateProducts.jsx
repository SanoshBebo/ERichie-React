import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    category: "",
    description: "",
    price: 0,
    productname: "",
    shopid: "",
    stock: 0,
    imageurl: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [productNotFound, setProductNotFound] = useState(false);

  useEffect(() => {
    // Fetch data from Firestore or API endpoint to populate the products list
    axios
      .get(
        "https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products"
      )
      .then((response) => {
        // Extract product data from the response
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          return {
            id: doc.name.split("/").pop(),
            category: data.category.stringValue,
            description: data.description.stringValue,
            price: data.price.integerValue,
            productname: data.productname.stringValue,
            shopid: data.shopid.stringValue,
            stock: data.stock.integerValue,
            imageurl: data.imageurl.stringValue,
          };
        });
        // Set products state with the retrieved data
        setProducts(productsData);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (product) => {
    setSelectedProduct(product);
    // Pre-populate the update form input fields with the selected product's data
    setUpdatedProduct({
      category: product.category,
      description: product.description,
      price: product.price,
      productname: product.productname,
      shopid: product.shopid,
      stock: product.stock,
      imageurl: product.imageurl,
    });
  };

  const handleInputChange = (field, value) => {
    setUpdatedProduct({
      ...updatedProduct,
      [field]: value,
    });
  };

  const handleUpdateProduct = () => {
    // Implement your update logic using the Firestore REST API or your backend API endpoint
    const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${selectedProduct.id}`;

    // Prepare the updated product data
    const updatedData = {
      fields: {
        category: { stringValue: updatedProduct.category },
        description: { stringValue: updatedProduct.description },
        price: { integerValue: updatedProduct.price },
        productname: { stringValue: updatedProduct.productname },
        shopid: { stringValue: updatedProduct.shopid },
        stock: { integerValue: updatedProduct.stock },
        imageurl: { stringValue: updatedProduct.imageurl },
      },
    };

    // Perform the API request using Axios to update the product
    axios
      .patch(apiUrl, updatedData)
      .then((response) => {
        console.log("Product updated successfully:", response.data);
        // Optionally, update the products list by fetching data again from the API
        // ...
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold mb-4">Update Product</h1>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              {/* Display product details */}
              <img
                src={product.imageurl}
                alt={product.productname}
                className="w-32 h-32 object-cover mx-auto mb-2"
              />
              <h3 className="text-lg font-semibold mb-2">{product.productname}</h3>
              <p>Category: {product.category}</p>
              <p>Description: {product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Shop ID: {product.shopid}</p>
              <p>Stock: {product.stock}</p>
              {/* Update button */}
              <button
                onClick={() => openUpdateForm(product)}
                className="bg-blue-500 text-white px-3 py-1 mt-2 rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          ))}
        </div>
        {/* Update form */}
        {selectedProduct && (
          <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-semibold mb-4">Update Product</h2>
            <label className="block font-semibold mb-2">Category:</label>
            <input
              type="text"
              value={updatedProduct.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <label className="block font-semibold mb-2">Description:</label>
            <input
              type="text"
              value={updatedProduct.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <label className="block font-semibold mb-2">Price:</label>
            <input
              type="number"
              value={updatedProduct.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <label className="block font-semibold mb-2">Product Name:</label>
            <input
              type="text"
              value={updatedProduct.productname}
              onChange={(e) => handleInputChange("productname", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <label className="block font-semibold mb-2">Shop ID:</label>
            <input
              type="text"
              value={updatedProduct.shopid}
              onChange={(e) => handleInputChange("shopid", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <label className="block font-semibold mb-2">Stock:</label>
            <input
              type="number"
              value={updatedProduct.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <label className="block font-semibold mb-2">Image URL:</label>
            <input
              type="text"
              value={updatedProduct.imageurl}
              onChange={(e) => handleInputChange("imageurl", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
            />
            <button
              onClick={handleUpdateProduct}
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-600"
            >
              Update Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProducts;
