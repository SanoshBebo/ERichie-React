import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductUpdateForm = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState({
    productname: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios
      .get('https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products')
      .then((response) => {
        const productsData = (response.data.documents || []).map((doc) => {
          const data = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            productname: data.productname?.stringValue || '',
          };
        });
        setProductList(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleProductChange = async (e) => {
    const selectedProductId = e.target.value;
    setProductId(selectedProductId);

    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${selectedProductId}`
      );

      const productData = response.data.fields;
      setProduct({
        productname: productData.productname?.stringValue || '',
        description: productData.description?.stringValue || '',
        price: productData.price?.integerValue || 0,
        stock: productData.stock?.integerValue || 0,
        imageUrl: productData.imageUrl?.stringValue || '',
        category: productData.category?.stringValue || '',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const apiKey = 'AIzaSyBwbUvnEMEOs1aNMf_XOjGegX00uZD7M2g';

      let imageUrl = product.imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await axios.post(
          `https://firebasestorage.googleapis.com/v0/b/mobileworld-160ce.appspot.com/o?name=Products%2F${imageFile.name}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.status === 200) {
          imageUrl = `https://firebasestorage.googleapis.com/v0/b/mobileworld-160ce.appspot.com/o/Products%2F${encodeURIComponent(
            imageFile.name
          )}?alt=media`;
        } else {
          console.error('Error uploading image:', uploadResponse.statusText);
        }
      }

      const updatedFields = {
        productname: { stringValue: product.productname },
        description: { stringValue: product.description },
        price: { integerValue: parseFloat(product.price) },
        stock: { integerValue: parseInt(product.stock) },
        category: { stringValue: product.category },
        imageUrl: { stringValue: imageUrl },
      };

      const firestoreResponse = await axios.patch(
        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${productId}?key=${apiKey}`,
        {
          fields: updatedFields,
        }
      );

      alert('Product updated successfully');
      setProduct({
        productname: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: imageUrl,
        category: '',
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Product</h2>
        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Select a Product:</label>
              <select
                onChange={handleProductChange}
                className="block w-full bg-gray-200 rounded-md p-2"
              >
                <option value="">Select a product</option>
                {productList.map((productItem) => (
                  <option key={productItem.id} value={productItem.id}>
                    {productItem.productname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Product Name:</label>
              <input
                type="text"
                name="productname"
                value={product.productname}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Description:</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Price:</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Stock:</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Category:</label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2"
              />
            </div>
          </div>
          {product.imageUrl && (
            <div className="mt-4">
              <img src={product.imageUrl} alt="Product Preview" className="max-w-full h-auto" />
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-md p-2 mt-4 hover:bg-blue-700"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateForm;
