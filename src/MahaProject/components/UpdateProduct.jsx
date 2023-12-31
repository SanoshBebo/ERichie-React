

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductUpdateForm = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState({
    productname: '',
    description: '',
    price: '',
    stock: '',
    imageurl: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products'
      )
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

  const handleProductChange = async (selectedProductId) => {
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
        imageurl: productData.imageurl?.stringValue || '',
        category: productData.category?.stringValue || '',
        shopid: productData.shopid?.stringValue || '',
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

  const handleSearch = () => {
    const results = productList.filter((productItem) =>
      productItem.productname.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const apiKey = 'AIzaSyBwbUvnEMEOs1aNMf_XOjGegX00uZD7M2g';

      let imageurl = product.imageurl;
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
          imageurl = `https://firebasestorage.googleapis.com/v0/b/mobileworld-160ce.appspot.com/o/Products%2F${encodeURIComponent(
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
        imageurl: { stringValue: imageurl },
        shopid: { stringValue: product.shopid },
      };

      const firestoreResponse = await axios.patch(
        `https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products/${productId}?key=${apiKey}`,
        {
          fields: updatedFields,
        }
      );

      toast.success('Product updated successfully', { position: toast.POSITION.TOP_CENTER });

      setProduct({
        productname: '',
        description: '',
        price: '',
        stock: '',
        imageurl: imageurl,
        category: '',
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="product-update-form-container">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800 text-black">Update Product</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-fields">
          <label>
            <span className="text-black">Search for a Product :</span>
            <input
              type="text"
              value={searchText}
              className="text-teal-600 text-black"
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by product name"
            />
            <button type="button" onClick={handleSearch}>
              Search
            </button>
          </label>
          <ul>
            {searchResults.map((productItem) => (
              <li key={productItem.id}>
                <button type="button" onClick={() => handleProductChange(productItem.id)}>
                  <span className="text-red-600 text-black">{productItem.productname}</span>
                </button>
              </li>
            ))}
          </ul>
          <label>
            <span className="text-black">Product Name:</span>
            <input
              type="text"
              name="productname"
              value={product.productname}
              onChange={handleChange}
              className="text-green-600 text-black"
            />
          </label>
          <label>
            <span className="text-black">Description:</span>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="text-purple-600 text-black"
            />
          </label>
          <label>
            <span className="text-black">Price:</span>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="text-indigo-600 text-black"
            />
          </label>
          <label>
            <span className="text-black">Stock:</span>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="text-yellow-600 text-black"
            />
          </label>
          <label>
            <span className="text-black">Category:</span>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="text-teal-600 text-black"
            />
          </label>
          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        {product.imageurl && (
          <div className="product-image-preview">
            <img src={product.imageurl} alt="Product Preview" />
          </div>
        )}
        <button type="submit" className="text-black bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
          Update Product
        </button>
      </form>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default ProductUpdateForm;
