// ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/updatedetailscard.css'


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newStock, setNewStock] = useState('');
  const [updateProductId, setUpdateProductId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false); // Add confirmation state
  const [productToDelete, setProductToDelete] = useState(null); // Track the product to delete



  useEffect(() => {


    const fetchData = async () => {
      try {

        const response = await axios.get(
          'https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products'
        );

        const productsData = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
            productname: doc.fields.productname, // Keep other fields unchanged
            price: doc.fields.price,
            imageurl: doc.fields.imageurl,
            category: doc.fields.category,
            description: doc.fields.description,
            stock: doc.fields.stock,
            shopid: doc.fields.shopid,
        }));

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (productId) => {
    setUpdateProductId(productId);
  };

  const handleConfirmUpdate = async (productId) => {
    if (!newStock) {
      alert('Please enter a valid stock value.');
      return;
    }
  
    try {
      
      const response = await axios.get(
        'https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products'
      );
  
      // Extract the document ID for the matching productname
      const matchingDocument = response.data.documents.find((doc) => doc.name.split('/').pop() === productId);
  
      // if (!matchingDocument) {
      //   return 'Product not found'; // Return a message if the product is not found
      // }
  
      const documentId = matchingDocument.name.split('/').pop(); // Extract the document ID
  
      // Create an object with the updated stock value
      const updatedData = {
        fields: {
          
          productname: matchingDocument.fields.productname, // Keep other fields unchanged
          price: matchingDocument.fields.price,
          imageurl: matchingDocument.fields.imageurl,
          category: matchingDocument.fields.category,
          description: matchingDocument.fields.description,
          stock: {integerValue: newStock},
          shopid: matchingDocument.fields.shopid
        },
      };
  
      // Perform the update using Axios PUT request

      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products/${documentId}`,
        updatedData,
      );
  
      // await axios.patch(
      //   `https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products/${productId}`,
      //   updatedFields
      // );
  
      // Update the local state after successful update
      const updatedProducts = products.map((product) =>
        product.id === productId
          ? { ...product, ...updatedData }
          : product
      );
  
      setProducts(updatedProducts);
      setNewStock('');
      setUpdateProductId(null);


      
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  

  const handleDelete = async (productId) => {

    const shouldDelete = window.confirm("Are you sure you want to delete this product?");
    if (!shouldDelete) {
      return; // User canceled the deletion
    }

    try {
      

      await axios.delete(
        `https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products/${productId}`,
      );

      // Remove the product from the local state after successful deletion
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }finally {
      // Reset confirmation state after delete operation
      setConfirmDelete(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="products">
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="card mb-4">
                <img src={product.imageurl.stringValue} className="card-img-top" alt={product.productname.stringValue} />
                <div className="card-body">
                  <h5 className="card-title">{product.productname.stringValue}</h5>
                  <p className="card-text">Stock: {product.stock.integerValue}</p>
                  {updateProductId === product.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New Stock"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                      />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleConfirmUpdate(product.id)}
                      >
                        Confirm Update
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => handleUpdate(product.id)}>
                      Update
                    </button>
                  )}
                  <button className="btn btn-danger ml-2" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
