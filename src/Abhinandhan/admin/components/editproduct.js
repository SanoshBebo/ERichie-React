import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

function EditProduct(productId) {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    description: '',
    modelno: '',
    price: '',
    productname: '',
    quantity: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Fetch the product details for editing based on productId from the URL
    axios
      .get(
        `https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products/${productId}`
      )
      .then((response) => {
        const data = response.data.fields;
        setProductData({
          description: data.description.stringValue,
          modelno: data.modelno.stringValue,
          price: data.price.doubleValue,
          productname: data.productname.stringValue,
          quantity: data.quantity.integerValue,
          imageUrl: data.imageUrl.stringValue,
        });
      })
      .catch((error) => {
        console.error('Error fetching product details: ', error);
      });
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleUpdateProduct = () => {
    // Prepare the updated product data
    const updatedProductData = {
      fields: {
        description: { stringValue: productData.description },
        modelno: { stringValue: productData.modelno },
        price: { doubleValue: parseFloat(productData.price) },
        productname: { stringValue: productData.productname },
        quantity: { integerValue: parseInt(productData.quantity) },
        imageUrl: { stringValue: productData.imageUrl },
      },
    };

    // Update the product in Firebase Firestore with the productId from the URL
    axios
      .patch(
        `https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products/${productId}`,
        updatedProductData
      )
      .then(() => {
        console.log('Product updated successfully');
        navigate('/admin/viewproducts');
      })
      .catch((error) => {
        console.error('Error updating product: ', error);
      });
  };

  const handleCancel = () => {
    navigate('/admin/viewproducts');
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={productData.description}
          onChange={handleInputChange}
        />
      </div>
      {/* ... (other input fields) ... */}
      <button className="btn btn-primary mr-2" onClick={handleUpdateProduct}>
        Save
      </button>
      <button className="btn btn-secondary" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}

export default EditProduct;
