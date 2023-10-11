import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewProducts() {

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProductId, setEditingProductId] = useState(null); // To track which product is being edited
  const [editedProductData, setEditedProductData] = useState({
    id: '', // To keep track of the product ID
    description: '',
    modelno: '',
    price: 0,
    productname: '',
    quantity: 0,
    imageUrl: '',

  });

  useEffect(() => {
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products'
      )
      .then((response) => {
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          const product = {
            id: doc.name.split('/').pop(),
            description: '',
            modelno: '',
            price: 0,
            productname: '',
            quantity: 0,
            imageUrl: '',
          };
  
          // Check if fields exist and set them if available
          if (data.description?.stringValue) {
            product.description = data.description.stringValue;
          }
          if (data.modelno?.stringValue) {
            product.modelno = data.modelno.stringValue;
          }
          if (data.price?.doubleValue) {
            product.price = data.price.doubleValue;
          }
          if (data.productname?.stringValue) {
            product.productname = data.productname.stringValue;
          }
          if (data.quantity?.integerValue) {
            product.quantity = data.quantity.integerValue;
          }
          if (data.imageUrl?.stringValue) {
            product.imageUrl = data.imageUrl.stringValue;
          }
  
          return product;
        });
  
        setAllProducts(productsData);
        setFilteredProducts(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, []); 
  useEffect(() => {
    const filtered = allProducts.filter((product) =>
      product.productname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  const handleEditProduct = (product) => {
    // Set the editingProductId to the clicked product ID
    setEditingProductId(product.id);
    // Set the edited product data with the found product data
    setEditedProductData(product);
  };

  const handleCancelEdit = () => {
    // Cancel editing by resetting the editingProductId
    setEditingProductId(null);
    // Clear the edited product data
    setEditedProductData({
      id: '',
      description: '',
      modelno: '',
      price: '',
      productname: '',
      quantity: '',
      imageUrl: '',
    });
  };

  const handleSaveEdit = () => {
    // Update the product data in the state
    const updatedProducts = allProducts.map((product) =>
      product.id === editedProductData.id ? editedProductData : product
    );
    setAllProducts(updatedProducts);
    // Reset the editingProductId to exit editing mode
    setEditingProductId(null);
  };
  
  const handleDeleteProduct = (productId) => {
    // Send a DELETE request to remove the product from the database
    axios
      .delete(
        `https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products/${productId}`
      )
      .then(() => {
        // Remove the product from the state
        const updatedProducts = allProducts.filter(
          (product) => product.id !== productId
        );
        setAllProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error deleting product: ', error);
      });
  };

  return (
    <div>
      <h1 style={{ color: 'white' }}>View Products</h1>
      {/* Search input */}
      <input
        style={{ padding: '10px' }}
        type="text"
        placeholder="Search by Product Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* List of filtered products */}
      {filteredProducts.map((product) => (
        <div key={product.id} className="card mt-3">
          <div className="card-body">
            {editingProductId === product.id ? (
              <div>
                {/* Display input fields for editing */}
                <input
                  type="text"
                  name="description"
                  value={editedProductData.description}
                  onChange={(e) =>
                    setEditedProductData({
                      ...editedProductData,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  name="modelno"
                  value={editedProductData.modelno}
                  onChange={(e) =>
                    setEditedProductData({
                      ...editedProductData,
                      modelno: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  name="price"
                  value={editedProductData.price}
                  onChange={(e) =>
                    setEditedProductData({
                      ...editedProductData,
                      price: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  name="productname"
                  value={editedProductData.productname}
                  onChange={(e) =>
                    setEditedProductData({
                      ...editedProductData,
                      productname: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  name="quantity"
                  value={editedProductData.quantity}
                  onChange={(e) =>
                    setEditedProductData({
                      ...editedProductData,
                      quantity: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  name="imageUrl"
                  value={editedProductData.imageUrl}
                  onChange={(e) =>
                    setEditedProductData({
                      ...editedProductData,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <button
                  className="btn btn-primary mr-2"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h5 className="card-title">{product.productname}</h5>
                <p className="card-text">
                  <strong>Description:</strong> {product.description}
                </p>
                <p className="card-text">
                  <strong>Model Number:</strong> {product.modelno}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> ${product.price}
                </p>
                <p className="card-text">
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                <img
                  style={{ width: '50%', height: '40%' }}
                  src={product.imageUrl}
                  alt={product.productname}
                  className="img-fluid"
                />
                <div className="mt-2">
                  {/* Use onClick to call the handleEditProduct function with product */}
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger" 
                  onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewProducts;
