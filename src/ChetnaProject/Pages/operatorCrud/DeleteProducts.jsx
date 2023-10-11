import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const DeleteProducts = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProduct = () => {
    // Implement your delete logic using the Firestore REST API or your backend API endpoint
    const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products/${selectedProduct.id}`;
    axios
      .delete(apiUrl)
      .then((response) => {
        console.log("Product deleted successfully:", response.data);
        // Close the delete modal after successful deletion
        closeDeleteModal();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Delete Product</h1>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:border-primary-color"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => openDeleteModal(product)}
          >
            {/* Display product details */}
            <img
              src={product.imageurl}
              alt={product.productname}
              className="w-32 h-32 object-cover mx-auto mb-2"
            />
            <h2 className="text-lg font-semibold mb-2">{product.productname}</h2>
            <p>Category: {product.category}</p>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Shop Name: {product.shopName}</p>
            {/* Delete button */}
            <button
              onClick={() => openDeleteModal(product)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal for confirming product deletion */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Product Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedProduct && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Product</h2>
            <p>Are you sure you want to delete {selectedProduct.productname}?</p>
            <div className="mt-4">
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Delete Product
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg ml-4 hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeleteProducts;
