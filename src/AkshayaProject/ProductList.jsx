import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const firestoreApiKey = 'AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U';
  const firestoreProjectId = 'e-ritchie';   
  const firestoreCollection = 'Products';

  const [products, setProducts] = useState([]);
  const [deleteProductName, setDeleteProductName] = useState('');
  const [updateProductDetails, setUpdateProductDetails] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    shopname: '',
    imageUrl: '',
  });
  const [updateImageFile, setUpdateImageFile] = useState(null);

  useEffect(() => {
    // Fetch products from Firestore
    axios
      .get(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}?key=${firestoreApiKey}`
      )
      .then((response) => {
        const fetchedProducts = response.data.documents.map((doc) => {
          const product = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            name: product.productname.stringValue,
            description: product.description.stringValue,
            price: product.price.doubleValue,
            stock: product.stock.integerValue,
            category: product.category.stringValue,
            shopname: product.shopname.stringValue,
            imageUrl: product.imageUrl.stringValue,
          };
        });
        setProducts(fetchedProducts);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });
  }, [firestoreApiKey, firestoreProjectId]);

  const handleUpdateProduct = async (event) => {
    event.preventDefault();

    try {
      let imageUrl = updateProductDetails.imageUrl; // Use the existing imageUrl by default

      // Check if a new image file is selected
      if (updateImageFile) {
        imageUrl = await uploadImageToFirebaseStorage(updateImageFile);
      }

      const updatedProductData = {
        productname: { stringValue: updateProductDetails.name },
        description: { stringValue: updateProductDetails.description },
        price: { doubleValue: parseFloat(updateProductDetails.price) },
        stock: { integerValue: parseInt(updateProductDetails.stock) },
        category: { stringValue: updateProductDetails.category },
        // shopname: { stringValue: updateProductDetails.shopname },
        imageUrl: { stringValue: imageUrl },
      };

      // Update product in Firebase
      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}/${updateProductDetails.id}?key=${firestoreApiKey}`,
        { fields: updatedProductData }
      );

      // Update the product in the products state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updateProductDetails.id ? { ...product, ...updateProductDetails, imageUrl } : product
        )
      );
      console.log('Product updated successfully:', updateProductDetails.name);
      setUpdateProductDetails({
        id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        // shopname: '',
        imageUrl: '',
      });
      setUpdateImageFile(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setUpdateImageFile(file);
  };

  const uploadImageToFirebaseStorage = async (file) => {
    try {
      const apiKey = firestoreApiKey;
      const bucketName = 'e-ritchie.appspot.com'; // Replace with your actual Firebase Storage bucket name
      const storagePath = `Products/${file.name}`;

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post(
        `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(storagePath)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (uploadResponse.status === 200) {
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
          storagePath
        )}?alt=media`;
        return downloadUrl;
      } else {
        console.error('Error uploading image:', uploadResponse.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleDeleteProduct = (productName) => {
    // Find product by name and get its ID
    const productToDelete = products.find((product) => product.name === productName);

    if (!productToDelete) {
      console.error('Product not found for deletion');
      return;
    }

    // Delete product from Firebase
    axios
      .delete(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}/${productToDelete.id}`
      )
      .then(() => {
        // Remove the deleted product from the products state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.name !== productName)
        );
        console.log('Product deleted successfully:', productName);
      })
      .catch((error) => {
        console.error('Error deleting product', error);
      });
  };

  const handleUpdateClick = (product) => {
    setUpdateProductDetails(product);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="product-list-container">
      <h2>Products</h2>
      <ul>
        
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div className="product-row"> 
            <strong>{product.name}</strong> - {product.description}, ${product.price}, Stock: {product.stock}, Category: {product.category}, Shop: {product.shopname}
            <button onClick={() => handleDeleteProduct(product.name)}>Delete</button>
            <button onClick={() => handleUpdateClick(product)}>Update</button>

            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            ) }
            </div>
        


            {updateProductDetails.id === product.id && (
              <form className="update-form" onSubmit={handleUpdateProduct}>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" value={updateProductDetails.name} onChange={handleInputChange} required />
                <label htmlFor="description">Description:</label>
                <textarea name="description" value={updateProductDetails.description} onChange={handleInputChange} required />
                <label htmlFor="price">Price:</label>
                <input type="number" name="price" value={updateProductDetails.price} onChange={handleInputChange} required />
                <label htmlFor="stock">Stock:</label>
                <input type="number" name="stock" value={updateProductDetails.stock} onChange={handleInputChange} required />
                <label htmlFor="category">Category:</label>
                <input type="text" name="category" value={updateProductDetails.category} onChange={handleInputChange} required />
                {/* <label htmlFor="shopname">Shop:</label>
                <input type="text" name="shopname" value={updateProductDetails.shopname} onChange={handleInputChange} required /> */}
                <label htmlFor="newImage">New Image:</label>
                <input type="file" name="newImage" accept="image/*" onChange={handleImageFileChange} />
                <button type="submit">Update</button>
              </form>
            )}
          </li>
        ))}
      </ul>
      
      {/* <button onClick={() => setProducts([])}>Hide Products</button> */}
    </div>
  );
};

export default ProductList;











