import React, { useState } from 'react';
import axios from 'axios';


function AddProduct() {
  const [productData, setProductData] = useState({
    category: 'gaming',
    description: '',
    modelno: '',
    price: '',
    productname: '',
    stock: '',
    imageurl: '',
    shopid: 'shopp08',
  });

  const addProductToFirestore = () => {
    const firestoreData = {
      fields: {
        category: { stringValue: productData.category },
        description: { stringValue: productData.description },
        modelno: { stringValue: productData.modelno },
        price: { doubleValue: parseFloat(productData.price) },
        productname: { stringValue: productData.productname },
        stock: { integerValue: parseInt(productData.stock) },
        imageurl: { stringValue: productData.imageurl },
        shopid: { stringValue: productData.shopid },
      },
    };

    axios
      .post(
        'https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products',
        firestoreData
      )
      .then(() => {
        console.log('Product added to Firestore');
        setProductData({
          category: '',
          description: '',
          modelno: '',
          price: '',
          productname: '',
          stock: '',
          imageurl: '',
          shopid: 'shopp08',
        });
      })
      .catch((error) => {
        console.error('Error adding product to Firestore: ', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Add Product</h2>
          <div className="form-group">
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={productData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Model Number"
            name="modelno"
            value={productData.modelno}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={productData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Product Name"
            name="productname"
            value={productData.productname}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Image URL"
            name="imageurl"
            value={productData.imageurl}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary" onClick={addProductToFirestore}>
          Add Product
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
