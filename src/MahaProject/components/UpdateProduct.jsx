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
  const [searchResults, setSearchResults] = useState([]); // State for search results
  // const [productList, setProductList] = useState([]);

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
    // const selectedProductId = e.target.value;
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
  const handleSearch = () => {

    // Filter the productList based on the searchText

    const results = productList.filter((productItem) =>

      productItem.productname.toLowerCase().includes(searchText.toLowerCase())

    );

    setSearchResults(results);

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
<div className="product-update-form-container">

<h2>Update Product</h2>

<form onSubmit={handleUpdate}>

  <div className="form-fields">

    <label>

      Search for a Product:

      <input

        type="text"

        value={searchText}

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

            {productItem.productname}

          </button>

        </li>

      ))}

    </ul>

    <label>

      Product Name:

      <input

        type="text"

        name="productname"

        value={product.productname}

        onChange={handleChange}

      />

    </label>

    <label>

      Description:

      <textarea

        name="description"

        value={product.description}

        onChange={handleChange}

      />

    </label>

    <label>

      Price:

      <input

        type="number"

        name="price"

        value={product.price}

        onChange={handleChange}

      />

    </label>

    <label>

      Stock:

      <input

        type="number"

        name="stock"

        value={product.stock}

        onChange={handleChange}

      />

    </label>

    <label>

      Category:

      <input

        type="text"

        name="category"

        value={product.category}

        onChange={handleChange}

      />

    </label>

    <label>

      Upload Image:

      <input type="file" accept="image/*" onChange={handleFileChange} />

    </label>

  </div>

  {product.imageUrl && (

    <div className="product-image-preview">

      <img src={product.imageUrl} alt="Product Preview" />

    </div>

  )}

  <button type="submit">Update Product</button>

</form>

</div>

);

};



export default ProductUpdateForm;