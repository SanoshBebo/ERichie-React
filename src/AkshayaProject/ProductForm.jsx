import React, { useState } from "react";
import axios from "axios";
import "./ProductForm.css";

const ProductForm = () => {
  const firestoreApiKey = "AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U";
  const firestoreProjectId = "e-ritchie";
  const firestoreCollection = "Products";

  const [product, setProduct] = useState({
    productname: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: "",
    shopname: "E-nerd", // Set shopname to 'E-nerd'
    shopid: "shop02", // Set shopid to 'shop12'
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImageToFirebaseStorage = async () => {
    try {
      const apiKey = firestoreApiKey;
      const bucketName = "e-ritchie.appspot.com"; // Replace with your Firebase Storage bucket name
      const storagePath = `products/${imageFile.name}`;

      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await axios.post(
        `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(
          storagePath
        )}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
          storagePath
        )}?alt=media`;
        return downloadUrl;
      } else {
        console.error("Error uploading image:", uploadResponse.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImageToFirebaseStorage();

      if (imageUrl) {
        // Add the shop ID to the product data
        const updatedProduct = {
          ...product,
          shopid: { stringValue: "shop02" }, // Replace with your desired shop ID
        };

        const firestoreResponse = await axios.post(
          `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}?key=${firestoreApiKey}`,
          {
            fields: {
              productname: { stringValue: product.productname },
              description: { stringValue: product.description },
              price: { doubleValue: parseFloat(product.price) },
              stock: { integerValue: parseInt(product.stock) },
              imageUrl: { stringValue: imageUrl },
              category: { stringValue: product.category },
              shopname: { stringValue: product.shopname },
              shopid: { stringValue: product.shopid }, // Add shop ID here
            },
          }
        );

        console.log("Product added:", firestoreResponse.data);
        setProduct({
          productname: "",
          description: "",
          price: "",
          stock: "",
          imageUrl: "",
          category: "",
          shopname: "",
          shopid: "",
        });
        setImageFile(null);
      } else {
        console.error("Error uploading image or retrieving image URL.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product-form-container bg-gray-200">
      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <label>
            Product Name:
            <input
              type="text"
              name="productname"
              value={product.productname}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Description:
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={product.Price}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Category:
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Shop Name:
            <input
              type="text"
              name="shopname"
              value={product.shopname}
              readOnly // Make this field read-only
            />
          </label>
          <br />

          <label>
            Shop ID:
            <input
              type="text"
              name="shopid"
              value={product.shopid}
              readOnly // Make this field read-only
            />
          </label>
          <br />

          <label>
            Image File:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        {imageFile && (
          <div>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Product Preview"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}

        <br />
        <button
          type="submit"
          className="p-2 bg-slate-400 border border-gray-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
