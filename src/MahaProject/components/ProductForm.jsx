import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [product, setProduct] = useState({
    productname: '',
    description: '',
    price: '',
    stock: '',
    imageurl: '',
    category: 'mobile',
    shopid: 'shop12',
    shopname: 'MobileWorld',
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

  const handleCancelImage = () => {
    setImageFile(null);
    setProduct({
      ...product,
      imageurl: '',
    });
  };

  const uploadImageToFirebaseStorage = async () => {
    try {
      const apiKey = 'YOUR_API_KEY';
      const bucketName = 'mobileworld-160ce.appspot.com';
      const storagePath = `Products/${imageFile.name}`;

      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await axios.post(
        `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(
          storagePath
        )}`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageurl = await uploadImageToFirebaseStorage();

      if (imageurl) {
        const apiKey = 'YOUR_API_KEY';

        const firestoreResponse = await axios.post(
          `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products?key=${apiKey}`,
          {
            fields: {
              productname: { stringValue: product.productname },
              description: { stringValue: product.description },
              price: { integerValue: parseFloat(product.price) },
              stock: { integerValue: parseInt(product.stock) },
              imageurl: { stringValue: imageurl },
              category: { stringValue: product.category },
              shopid: { stringValue: product.shopid },
              shopname: { stringValue: product.shopname },
            },
          }
        );

        console.log('Product added:', firestoreResponse.data);
        setProduct({
          productname: '',
          description: '',
          price: '',
          stock: '',
          imageurl: '',
          category: 'mobile',
          shopid: 'shop12',
          shopname: 'MobileWorld',
        });
        setImageFile(null);
      } else {
        console.error('Error uploading image or retrieving image URL.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add a New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Product Name:</label>
              <input
                type="text"
                name="productname"
                value={product.productname}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Description:</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Price:</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Stock:</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Category:</label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Shop ID:</label>
              <input
                type="text"
                name="shopid"
                value={product.shopid}
                onChange={handleChange}
                readOnly
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Shop Name:</label>
              <input
                type="text"
                name="shopname"
                value={product.shopname}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Image File:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
            </div>
            {imageFile && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Product Preview"
                  className="max-w-xs mx-auto"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
