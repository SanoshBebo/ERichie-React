// ProductList.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../styles/updatedetailscard.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newStock, setNewStock] = useState('');
  const [newPrice, setNewPrice] = useState(''); // State for the new price

  const [updateProductId, setUpdateProductId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false); // Add confirmation state
  const [productToDelete, setProductToDelete] = useState(null); // Track the product to delete

  const [visible, setVisible] = useState(false);
  const toast = useRef(null);

 

  useEffect(() => {


    const fetchData = async () => {
      try {

        const response = await axios.get(
          'https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products'
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
    if (!newStock && !newPrice) {
      alert('Please enter a valid stock value.and price values.');
      return;
    }
  
    try {
      
      const response = await axios.get(
        'https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products'
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
          price: {integerValue: newPrice || matchingDocument.fields.price.integerValue},
          imageurl: matchingDocument.fields.imageurl,
          category: matchingDocument.fields.category,
          description: matchingDocument.fields.description,
          stock: {integerValue: newStock || matchingDocument.fields.stock.integerValue},
          shopid: matchingDocument.fields.shopid
        },
      };
  
      // Perform the update using Axios PUT request

      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products/${documentId}`,
        updatedData,
      );
  
      // await axios.patch(
      //   `https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products/${productId}`,
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
      setNewPrice(''); // Reset price state

      setUpdateProductId(null);

      toast.success('Data Updated!!', {
        position: 'top-right',
        autoClose: 3000, // Time in milliseconds to keep the toast open
      });


      
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  

  const handleDelete = async (productId) => {
    // Define the function to handle the delete action
    const handleConfirmDelete = async () => {
      try {
        await axios.delete(
          `https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products/${productId}`,
        );
        toast.success('Data Deleted!!', {
          position: 'top-right',
          autoClose: 3000, // Time in milliseconds to keep the toast open
        });
  
        // Remove the product from the local state after successful deletion
        const updatedProducts = products.filter((product) => product.id !== productId);
        setProducts(updatedProducts);
  
        toast.success('Data Deleted!!', {
          position: 'top-right',
          autoClose: 3000, // Time in milliseconds to keep the toast open
        });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
  
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: handleConfirmDelete, // Call the delete function when "Yes" is clicked
        },
        {
          label: 'No',
          onClick: () => {}, // Do nothing if "No" is clicked
        },
      ],
    });
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
                  <p className="card-text">Price: {product.price.integerValue}</p>
                  {updateProductId === product.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New Stock"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New Price"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
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
