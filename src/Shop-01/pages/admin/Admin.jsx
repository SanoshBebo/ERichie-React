


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './styles.css';

// function ProductComponent() {
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     category: '',
//     productname: '',
//     description: '',
//     shopid: 'shop17',
//     stock: '',
//     price: '',
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [editedProduct, setEditedProduct] = useState(null); // Track the edited product

//   const apiUrl = "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products";

//   // Function to fetch products from Firestore
//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(apiUrl);
//       if (response.data && response.data.documents) {
//         const productsData = response.data.documents.map((doc) => {
//           const fields = doc.fields;
//           return {
//             id: doc.name.split('/').pop(),
//           category: fields.category?.stringValue || '', // Use optional chaining and provide a default value
//           productname: fields.productname?.stringValue || '',
//           description: fields.description?.stringValue || '',
//           shopid: fields.shopid?.stringValue || '',
//           stock: fields.stock?.integerValue || 0, // Use 0 as the default value for integer fields
//           price: fields.price?.doubleValue || 0.0, // Use 0.0 as the default value for double fields
//           imageurl: fields.imageurl?.stringValue || '',
//           };
//         });
//         setProducts(productsData);
//       } else {
//         console.error('No products found in the response:', response);
//       }
//     } catch (error) {
//       console.error('Error reading products:', error);
//     }
//   };

//   // Function to handle adding a new product
//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       if (imageFile) {
//         // Your Firebase API Key
//         const apiKey = 'YOUR_FIREBASE_API_KEY'; // Replace with your Firebase API Key

//         // Create a Firestore document with the product data including the image URL
//         const formData = new FormData();
//         formData.append('file', imageFile);

//         // Upload the image to Firebase Storage
//         const uploadResponse = await axios.post(
//           `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o?name=products%2F${imageFile.name}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );

//         if (uploadResponse.status === 200) {
//           const imageurl = `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o/products%2F${encodeURIComponent(imageFile.name)}?alt=media`;

//           // Create a Firestore document for the new product
//           const firestoreResponse = await axios.post(
//             `https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products?key=${apiKey}`,
//             {
//               fields: {
//                 category: { stringValue: newProduct.category },
//                 productname: { stringValue: newProduct.productname },
//                 description: { stringValue: newProduct.description },
//                 shopid: { stringValue: 'shop17' },
//                 stock: { integerValue: parseInt(newProduct.stock) },
//                 price: { doubleValue: parseFloat(newProduct.price) },
//                 imageurl: { stringValue: imageurl },
//               },
//             }
//           );

//           console.log('Product added:', firestoreResponse.data);
//           fetchProducts(); // Fetch products again to update the list
//           setNewProduct({
//             category: '',
//             productname: '',
//             description: '',
//             stock: '',
//             price: '',
//             shopid: 'shop17',
//           });
//         } else {
//           console.error('Error uploading image:', uploadResponse.statusText);
//         }
//       } else {
//         console.error('No image selected.');
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//     }
//   };

//   // Function to handle clicking the "Edit" button for a product
//   const handleEditClick = (product) => {
//     // Set the edited product when clicking the Edit button
//     setEditedProduct({ ...product });
//   };

//   // Function to handle saving changes to an edited product
//   const handleEditSave = async () => {
//     if (!editedProduct) return;

//     const productUrl = `${apiUrl}/${editedProduct.id}`;
//     const payload = {
//       fields: {
//         productname: { stringValue: editedProduct.productname },
//         description: { stringValue: editedProduct.description },
//         category: { stringValue: editedProduct.category }, // Include category field
//         stock: { integerValue: editedProduct.stock },
//         price: { doubleValue: editedProduct.price },
//         imageurl: { stringValue: editedProduct.imageurl },
//       },
//     };

//     try {
//       await axios.patch(productUrl, payload);
//       fetchProducts();
//       setEditedProduct(null); // Clear the edited product
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   // Function to handle deleting a product
//   const handleDeleteProduct = async (documentIdToDelete) => {
//     try {
//       // Construct the product URL using the document ID
//       const productUrl = `${apiUrl}/${documentIdToDelete}`;

//       // Send a DELETE request to delete the product
//       await axios.delete(productUrl);

//       // Fetch the updated products list
//       fetchProducts();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   // Function to handle input field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   // Function to handle file input changes
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };

//   useEffect(() => {
//     fetchProducts(); // Fetch products on component mount
//   }, []);

//   return (
//     <div>
//       <div className='product-form'>
//         <h2 style={{ textAlign: "center" }}>Add a New Product</h2>
//         <form onSubmit={handleAddProduct}>
//           <div className="input-container">
//             <label>
//               Product Name
//               <input
//                 type="text"
//                 name="productname"
//                 value={newProduct.productname}
//                 onChange={handleChange}
//               />
//             </label>
//             <br />
//             <label>
//               Description
//               <input
//                 type="text"
//                 name="description"
//                 value={newProduct.description}
//                 onChange={handleChange}
//               />
//             </label>
//             <br />
//             <label>
//               Category
//               <input
//                 type="text"
//                 name="category"
//                 value={newProduct.category}
//                 onChange={handleChange}
//               />
//             </label>
//             <br />
//             <label>
//               Stock
//               <input
//                 type="number"
//                 name="stock"
//                 value={newProduct.stock}
//                 onChange={handleChange}
//               />
//             </label>
//             <br />
//             <label>
//               Price
//               <input
//                 type="number"
//                 name="price"
//                 value={newProduct.price}
//                 onChange={handleChange}
//               />
//             </label>
//           </div>
//           <label>
//             Image File
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//           </label>
//           <br />
//           <button type="submit">Add Product</button>
//         </form>
//       </div>

//       <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Products</h1>
//       <div className="product-list">
//         {products.map((product) => (
//           <div key={product.id} className="product-card">
//             {editedProduct && editedProduct.id === product.id ? (
//               <div className="editable-fields">
//                 {/* Render editable fields when editing */}
//                 <div className="field">
//                   <h4>Product Name</h4>
//                   <input
//                     type="text"
//                     value={editedProduct.productname}
//                     onChange={(e) =>
//                       setEditedProduct({
//                         ...editedProduct,
//                         productname: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="field">
//                   <h4>Description</h4>
//                   <input
//                     type="text"
//                     value={editedProduct.description}
//                     onChange={(e) =>
//                       setEditedProduct({
//                         ...editedProduct,
//                         description: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="field">
//                   <h4>Category</h4> {/* Add category field */}
//                   <input
//                     type="text"
//                     value={editedProduct.category}
//                     onChange={(e) =>
//                       setEditedProduct({
//                         ...editedProduct,
//                         category: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="field">
//                   <h4>Stock</h4>
//                   <input
//                     type="number"
//                     value={editedProduct.stock}
//                     onChange={(e) =>
//                       setEditedProduct({
//                         ...editedProduct,
//                         stock: parseInt(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="field">
//                   <h4>Price</h4>
//                   <input
//                     type="number"
//                     value={editedProduct.price}
//                     onChange={(e) =>
//                       setEditedProduct({
//                         ...editedProduct,
//                         price: parseFloat(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <button onClick={handleEditSave}>Save</button>
//               </div>
//             ) : (
//               <>
//                 {/* Render product details when not editing */}
//                 <div key={product.id} className="product-details">
//                   <label>Product Name</label>
//                   <span>{product.productname}</span>
//                   <label>Description</label>
//                   <span>{product.description}</span>
//                   <label>Category</label> {/* Display category */}
//                   <span>{product.category}</span>
//                   <label>Stock</label>
//                   <span>{product.stock}</span>
//                   <label>Price</label>
//                   <span>{product.price}</span>
//                   <img src={product.imageurl} alt={product.productname} />
//                   <button className="edit-button" onClick={() => handleEditClick(product)}>Edit</button>
//                   <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProductComponent;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './styles.css';

// function ProductComponent() {
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     category: '',
//     productname: '',
//     description: '',
//     shopid: 'shop17',
//     stock: '',
//     price: '',
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [editedProduct, setEditedProduct] = useState(null); // Track the edited product
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const apiUrl =
//     'https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products';

//   // Function to fetch products from Firestore
//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(apiUrl);
//       if (response.data && response.data.documents) {
//         const productsData = response.data.documents.map((doc) => {
//           const fields = doc.fields;
//           return {
//             id: doc.name.split('/').pop(),
//             category: fields.category?.stringValue || '', // Use optional chaining and provide a default value
//             productname: fields.productname?.stringValue || '',
//             description: fields.description?.stringValue || '',
//             shopid: fields.shopid?.stringValue || '',
//             stock: fields.stock?.integerValue || 0, // Use 0 as the default value for integer fields
//             price: fields.price?.doubleValue || 0.0, // Use 0.0 as the default value for double fields
//             imageurl: fields.imageurl?.stringValue || '',
//           };
//         });
//         setProducts(productsData);
//         setFilteredProducts(productsData); // Initialize filtered products with all products
//       } else {
//         console.error('No products found in the response:', response);
//       }
//     } catch (error) {
//       console.error('Error reading products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(); // Fetch products on component mount
//   }, []);

//   // Function to handle input field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   // Function to handle file input changes
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };

//   // Function to handle adding a new product
//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       if (imageFile) {
//         // Your Firebase API Key
//         const apiKey = 'YOUR_FIREBASE_API_KEY'; // Replace with your Firebase API Key

//         // Create a Firestore document with the product data including the image URL
//         const formData = new FormData();
//         formData.append('file', imageFile);

//         // Upload the image to Firebase Storage
//         const uploadResponse = await axios.post(
//           `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o?name=products%2F${imageFile.name}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );

//         if (uploadResponse.status === 200) {
//           const imageurl = `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o/products%2F${encodeURIComponent(
//             imageFile.name
//           )}?alt=media`;

//           // Create a Firestore document for the new product
//           const firestoreResponse = await axios.post(
//             `https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products?key=${apiKey}`,
//             {
//               fields: {
//                 category: { stringValue: newProduct.category },
//                 productname: { stringValue: newProduct.productname },
//                 description: { stringValue: newProduct.description },
//                 shopid: { stringValue: 'shop17' },
//                 stock: { integerValue: parseInt(newProduct.stock) },
//                 price: { doubleValue: parseFloat(newProduct.price) },
//                 imageurl: { stringValue: imageurl },
//               },
//             }
//           );

//           console.log('Product added:', firestoreResponse.data);
//           fetchProducts(); // Fetch products again to update the list
//           setNewProduct({
//             category: '',
//             productname: '',
//             description: '',
//             stock: '',
//             price: '',
//             shopid: 'shop17',
//           });
//         } else {
//           console.error('Error uploading image:', uploadResponse.statusText);
//         }
//       } else {
//         console.error('No image selected.');
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//     }
//   };

//   // Function to handle clicking the "Edit" button for a product
//   const handleEditClick = (product) => {
//     // Set the edited product when clicking the Edit button
//     setEditedProduct({ ...product });
//   };

//   // Function to handle saving changes to an edited product
//   const handleEditSave = async () => {
//     if (!editedProduct) return;

//     const productUrl = `${apiUrl}/${editedProduct.id}`;
//     const payload = {
//       fields: {
//         productname: { stringValue: editedProduct.productname },
//         description: { stringValue: editedProduct.description },
//         category: { stringValue: editedProduct.category }, // Include category field
//         stock: { integerValue: editedProduct.stock },
//         price: { doubleValue: editedProduct.price },
//         imageurl: { stringValue: editedProduct.imageurl },
//       },
//     };

//     try {
//       await axios.patch(productUrl, payload);
//       fetchProducts();
//       setEditedProduct(null); // Clear the edited product
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Function to handle deleting a product
//   const handleDeleteProduct = async (documentIdToDelete) => {
//     try {
//       // Construct the product URL using the document ID
//       const productUrl = `${apiUrl}/${documentIdToDelete}`;

//       // Send a DELETE request to delete the product
//       await axios.delete(productUrl);

//       // Fetch the updated products list
//       fetchProducts();
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Function to handle search input changes
//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     const filtered = products.filter((product) =>
//       product.productname.toLowerCase().includes(term.toLowerCase())
//     );
//     setFilteredProducts(filtered);
//   };

//   // Define the number of products to display per row
//   const productsPerRow = 3;

//   return (
//     <div>
//       <div className="product-form">
//         <h2 style={{ textAlign: 'center' }}>Add a New Product</h2>
//         <form onSubmit={handleAddProduct}>
//           <div className="input-container">
//             {/* ... (existing form fields) */}
//           </div>
//           <label>
//             Image File
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//           </label>
//           <br />
//           <button type="submit">Add Product</button>
//         </form>
//       </div>

//       <div>
//         <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Products</h1>
//         <input
//           type="text"
//           placeholder="Search by Product Name"
//           value={searchTerm}
//           onChange={handleSearchChange}
//         />
//         <div className="product-list">
//           {filteredProducts.map((product, index) => (
//             <div
//               key={product.id}
//               className="product-card"
//               style={{
//                 marginLeft: index % productsPerRow === 0 ? '0' : '20px',
//               }}
//             >
//               {editedProduct && editedProduct.id === product.id ? (
//                 <div className="editable-fields">
//                   {/* ... (editable fields) */}
//                 </div>
//               ) : (
//                 <>
//                   <div key={product.id} className="product-details">
//                     {/* ... (product details) */}
//                     <label>Product Name</label>
//                  <span>{product.productname}</span>
//                  <label>Description</label>
//                  <span>{product.description}</span>
//                  <label>Category</label> {/* Display category */}
//                  <span>{product.category}</span>
//                  <label>Stock</label>
//                  <span>{product.stock}</span>
//                  <label>Price</label>
//                   <span>{product.price}</span>
//                   <img src={product.imageurl} alt={product.productname} />
//                  <button className="edit-button" onClick={() => handleEditClick(product)}>Edit</button>
//                  <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
               
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductComponent;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles.css';

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    category: '',
    productname: '',
    description: '',
    shopid: 'shop17',
    stock: '',
    price: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null); // Track the edited product
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products';

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.documents) {
        const productsData = response.data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            category: fields.category?.stringValue || '', // Use optional chaining and provide a default value
            productname: fields.productname?.stringValue || '',
            description: fields.description?.stringValue || '',
            shopid: fields.shopid?.stringValue || '',
            stock: fields.stock?.integerValue || 0, // Use 0 as the default value for integer fields
            price: fields.price?.integerValue || 0, // Use 0.0 as the default value for double fields
            imageurl: fields.imageurl?.stringValue || '',
          };
        });
        setProducts(productsData);
        setFilteredProducts(productsData); // Initialize filtered products with all products
      } else {
        console.error('No products found in the response:', response);
      }
    } catch (error) {
      console.error('Error reading products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  // Function to handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Function to handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Function to handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (imageFile) {
        // Your Firebase API Key
        const apiKey = 'YOUR_FIREBASE_API_KEY'; // Replace with your Firebase API Key

        // Create a Firestore document with the product data including the image URL
        const formData = new FormData();
        formData.append('file', imageFile);

        // Upload the image to Firebase Storage
        const uploadResponse = await axios.post(
          `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o?name=products%2F${imageFile.name}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.status === 200) {
          const imageurl = `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o/products%2F${encodeURIComponent(
            imageFile.name
          )}?alt=media`;

          // Create a Firestore document for the new product
          const firestoreResponse = await axios.post(
            `https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products?key=${apiKey}`,
            {
              fields: {
                category: { stringValue: newProduct.category },
                productname: { stringValue: newProduct.productname },
                description: { stringValue: newProduct.description },
                shopid: { stringValue: 'shop17' },
                stock: { integerValue: parseInt(newProduct.stock) },
                price: { doubleValue: parseFloat(newProduct.price) },
                imageurl: { stringValue: imageurl },
              },
            }
          );

          console.log('Product added:', firestoreResponse.data);
          fetchProducts(); // Fetch products again to update the list
          setNewProduct({
            category: '',
            productname: '',
            description: '',
            stock: '',
            price: '',
            shopid: 'shop17',
          });
        } else {
          console.error('Error uploading image:', uploadResponse.statusText);
        }
      } else {
        console.error('No image selected.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Function to handle clicking the "Edit" button for a product
  const handleEditClick = (product) => {
    // Set the edited product when clicking the Edit button
    setEditedProduct({ ...product });
  };

  // Function to handle saving changes to an edited product
  const handleEditSave = async () => {
    if (!editedProduct) return;

    const productUrl = `${apiUrl}/${editedProduct.id}`;
    const payload = {
      fields: {
        productname: { stringValue: editedProduct.productname },
        description: { stringValue: editedProduct.description },
        category: { stringValue: editedProduct.category }, // Include category field
        stock: { integerValue: editedProduct.stock },
        price: { doubleValue: editedProduct.price },
        imageurl: { stringValue: editedProduct.imageurl },
      },
    };

    try {
      await axios.patch(productUrl, payload);
      fetchProducts();
      setEditedProduct(null); // Clear the edited product
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle deleting a product
  const handleDeleteProduct = async (documentIdToDelete) => {
    try {
      // Construct the product URL using the document ID
      const productUrl = `${apiUrl}/${documentIdToDelete}`;

      // Send a DELETE request to delete the product
      await axios.delete(productUrl);

      // Fetch the updated products list
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const productsPerRow = 3;

  return (
    <div className='admin'>
    <div className="header">
        <div className="left">
          {/* <button className="header-button">E ritche Statistics</button> */}
          <Link to="/ericthe-statistics">
          <button className="header-button">Ericthe Statistics</button>
        </Link>
        </div>
        <div className="center">
          <h1>Admin</h1>
        </div>
        <div className="right">
        <Link to="/report">
          <button className="header-button">Sales Report</button>
        </Link>
        </div>
      </div>
      <div className="product-form">
        <h2 style={{ textAlign: 'center' }}>Add a New Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="input-container">
            <label>
              Product Name
              <input
                type="text"
                name="productname"
                value={newProduct.productname}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Description
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Category
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Stock
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Price
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Image File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <br />
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className='container'>
        <h1 style={{ textAlign: 'center', marginTop: '50px' , marginBottom:'50px'}} className='product-h1'>Products</h1>
        <input 
          className='input-bar'
          type="text"
          placeholder="Search by Product Name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="product-list">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                marginLeft: index % productsPerRow === 0 ? '0' : '20px',
              }}
            >
              {editedProduct && editedProduct.id === product.id ? (
                <div className="editable-fields">
                  <div className="field">
                    <h4>Product Name</h4>
                    <input
                      type="text"
                      value={editedProduct.productname}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          productname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <h4>Description</h4>
                    <input
                      type="text"
                      value={editedProduct.description}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <h4>Category</h4>
                    <input
                      type="text"
                      value={editedProduct.category}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <h4>Stock</h4>
                    <input
                      type="number"
                      value={editedProduct.stock}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          stock: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <h4>Price</h4>
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <button onClick={handleEditSave}>Save</button>
                </div>
              ) : (
                <>
                  <div key={product.id} className="product-details ">
                    <label>Product Name</label>
                    <span>{product.productname}</span>
                    <label>Description</label>
                    <span>{product.description}</span>
                    <label>Category</label>
                    <span>{product.category}</span>
                    <label>Stock</label>
                    <span>{product.stock}</span>
                    <label>Price</label>
                    <span>{product.price}</span>
                    <img src={product.imageurl} alt={product.productname} />
                    <div className='btn'>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                    </div>
                    
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './styles.css';

// function ProductComponent() {
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     category: '',
//     productname: '',
//     description: '',
//     shopid: 'shop17',
//     stock: '',
//     price: '',
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [editedProduct, setEditedProduct] = useState(null); // Track the edited product

//   const apiUrl =
//     "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products";

//   // Function to fetch products from Firestore
//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(apiUrl);
//       if (response.data && response.data.documents) {
//         const productsData = response.data.documents.map((doc) => {
//           const fields = doc.fields;
//           return {
//             id: doc.name.split('/').pop(),
//             category: fields.category?.stringValue || '', // Use optional chaining and provide a default value
//             productname: fields.productname?.stringValue || '',
//             description: fields.description?.stringValue || '',
//             shopid: fields.shopid?.stringValue || '',
//             stock: fields.stock?.integerValue || 0, // Use 0 as the default value for integer fields
//             price: fields.price?.doubleValue || 0.0, // Use 0.0 as the default value for double fields
//             imageurl: fields.imageurl?.stringValue || '',
//           };
//         });
//         setProducts(productsData);
//       } else {
//         console.error('No products found in the response:', response);
//       }
//     } catch (error) {
//       console.error('Error reading products:', error);
//     }
//   };

//   // Function to handle adding a new product
//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       if (imageFile) {
//         // Your Firebase API Key
//         const apiKey = 'YOUR_FIREBASE_API_KEY'; // Replace with your Firebase API Key

//         // Create a Firestore document with the product data including the image URL
//         const formData = new FormData();
//         formData.append('file', imageFile);

//         // Upload the image to Firebase Storage
//         const uploadResponse = await axios.post(
//           `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o?name=products%2F${imageFile.name}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );

//         if (uploadResponse.status === 200) {
//           const imageurl = `https://firebasestorage.googleapis.com/v0/b/crud-550f3.appspot.com/o/products%2F${encodeURIComponent(
//             imageFile.name
//           )}?alt=media`;

//           // Create a Firestore document for the new product
//           const firestoreResponse = await axios.post(
//             `https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products?key=${apiKey}`,
//             {
//               fields: {
//                 category: { stringValue: newProduct.category },
//                 productname: { stringValue: newProduct.productname },
//                 description: { stringValue: newProduct.description },
//                 shopid: { stringValue: 'shop17' },
//                 stock: { integerValue: parseInt(newProduct.stock) },
//                 price: { doubleValue: parseFloat(newProduct.price) },
//                 imageurl: { stringValue: imageurl },
//               },
//             }
//           );

//           console.log('Product added:', firestoreResponse.data);
//           fetchProducts(); // Fetch products again to update the list
//           setNewProduct({
//             category: '',
//             productname: '',
//             description: '',
//             stock: '',
//             price: '',
//             shopid: 'shop17',
//           });
//         } else {
//           console.error('Error uploading image:', uploadResponse.statusText);
//         }
//       } else {
//         console.error('No image selected.');
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//     }
//   };

//   // Function to handle clicking the "Edit" button for a product
//   const handleEditClick = (product) => {
//     // Set the edited product when clicking the Edit button
//     setEditedProduct({ ...product });
//   };

//   // Function to handle saving changes to an edited product
//   const handleEditSave = async () => {
//     if (!editedProduct) return;

//     const productUrl = `${apiUrl}/${editedProduct.id}`;
//     const payload = {
//       fields: {
//         productname: { stringValue: editedProduct.productname },
//         description: { stringValue: editedProduct.description },
//         category: { stringValue: editedProduct.category }, // Include category field
//         stock: { integerValue: editedProduct.stock },
//         price: { doubleValue: editedProduct.price },
//         imageurl: { stringValue: editedProduct.imageurl },
//       },
//     };

//     try {
//       await axios.patch(productUrl, payload);
//       fetchProducts();
//       setEditedProduct(null); // Clear the edited product
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Function to handle deleting a product
//   const handleDeleteProduct = async (documentIdToDelete) => {
//     try {
//       // Construct the product URL using the document ID
//       const productUrl = `${apiUrl}/${documentIdToDelete}`;

//       // Send a DELETE request to delete the product
//       await axios.delete(productUrl);

//       // Fetch the updated products list
//       fetchProducts();
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Function to handle input field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   // Function to handle file input changes
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };

//   useEffect(() => {
//     fetchProducts(); // Fetch products on component mount
//   }, []);

//   return (
//     <div>
//       <div className='product-form'>
//         <h2>Add a New Product</h2>
//         <form onSubmit={handleAddProduct}>
//           <div className='input-container'>
//             <label>
//               Product Name
//               <input
//                 type='text'
//                 name='productname'
//                 value={newProduct.productname}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//           <div className='input-container'>
//             <label>
//               Description
//               <input
//                 type='text'
//                 name='description'
//                 value={newProduct.description}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//           <div className='input-container'>
//             <label>
//               Category
//               <input
//                 type='text'
//                 name='category'
//                 value={newProduct.category}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//           <div className='input-container'>
//             <label>
//               Stock
//               <input
//                 type='number'
//                 name='stock'
//                 value={newProduct.stock}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//           <div className='input-container'>
//             <label>
//               Price
//               <input
//                 type='number'
//                 name='price'
//                 value={newProduct.price}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           </div>
//           <div className='input-container'>
//             <label>
//               Image
//               <input
//                 type='file'
//                 accept='image/*'
//                 onChange={handleFileChange}
//                 required
//               />
//             </label>
//           </div>
//           <button type='submit'>Add Product</button>
//         </form>
//       </div>

//       <div className='product-list'>
//         {products.map((product) => (
//           <div key={product.id} className='product-card'>
//             <div className='product-details'>
//               <img src={product.imageurl} alt={product.productname} />
//               <label>Name:</label>
//               <span>{product.productname}</span>
//               <label>Description:</label>
//               <span>{product.description}</span>
//               <label>Category:</label>
//               <span>{product.category}</span>
//               <label>Stock:</label>
//               <span>{product.stock}</span>
//               <label>Price:</label>
//               <span>${product.price.toFixed(2)}</span>
//               <div className='editable-fields'>
//                 {editedProduct && editedProduct.id === product.id ? (
//                   <>
//                     <div className='field'>
//                       <label>Name:</label>
//                       <input
//                         type='text'
//                         value={editedProduct.productname}
//                         onChange={(e) =>
//                           setEditedProduct({
//                             ...editedProduct,
//                             productname: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className='field'>
//                       <label>Description:</label>
//                       <input
//                         type='text'
//                         value={editedProduct.description}
//                         onChange={(e) =>
//                           setEditedProduct({
//                             ...editedProduct,
//                             description: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className='field'>
//                       <label>Category:</label>
//                       <input
//                         type='text'
//                         value={editedProduct.category}
//                         onChange={(e) =>
//                           setEditedProduct({
//                             ...editedProduct,
//                             category: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className='field'>
//                       <label>Stock:</label>
//                       <input
//                         type='number'
//                         value={editedProduct.stock}
//                         onChange={(e) =>
//                           setEditedProduct({
//                             ...editedProduct,
//                             stock: parseInt(e.target.value),
//                           })
//                         }
//                       />
//                     </div>
//                     <div className='field'>
//                       <label>Price:</label>
//                       <input
//                         type='number'
//                         value={editedProduct.price}
//                         onChange={(e) =>
//                           setEditedProduct({
//                             ...editedProduct,
//                             price: parseFloat(e.target.value),
//                           })
//                         }
//                       />
//                     </div>
//                     <button
//                       className='edit-button'
//                       onClick={() => handleEditSave(product.id)}
//                     >
//                       Save
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       className='edit-button'
//                       onClick={() => handleEditClick(product)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className='delete-button'
//                       onClick={() => handleDeleteProduct(product.id)}
//                     >
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProductComponent;
