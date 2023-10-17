
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles.css'; // Updated stylesheet reference
import { toast } from 'react-toastify';
import { useSelector , useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../../SanoshProject/redux/shopOneUserSlice';




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
  const navigate = useNavigate();
  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products';

  // Function to fetch products from Firestore
  const user = useSelector((state) => state.shoponeuser.user);
 
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);  


useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);


  const handleSignOut = () => {

    localStorage.removeItem("user");

    navigate("/admin/login");

  };

  useEffect(() => { 
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "hariniadmin@gmail.com") {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);
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
            price: fields.price?.integerValue || 0, 
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

  

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (imageFile) {
        // Your Firebase API Key
        const apiKey = 'YOUR_FIREBASE_API_KEY'; 
  
        // Validate the stock value
        const stockValue = parseInt(newProduct.stock);
        if (isNaN(stockValue) || stockValue < 0) {
          toast.error('Stock should be a non-negative number.');
          return;
        }
  
        // Validate the price value
        const priceValue = parseFloat(newProduct.price);
        if (isNaN(priceValue) || priceValue < 0) {
          toast.error('Price should be a non-negative number.');
          return;
        }

  
        if (!isNaN(newProduct.category)) {
          toast.error('Category cannot be a numeric value');
          return;
        }
  
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
                stock: { integerValue: stockValue }, // Use the validated stock value
                price: { integerValue: priceValue }, // Use the validated price value
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

          toast.success('Product added successfully');
        } else {
          console.error('Error uploading image:', uploadResponse.statusText);
        }
      } else {
        toast.error('No image selected.');
      }
    } catch (error) {
      toast.error('Error adding product:', error);
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
    <div className='shop17-admin'> {/* Updated class name */}
      <div className="shop17-header"> {/* Updated class name */}
        <div className="shop17-left"> {/* Updated class name */}
          <Link to="/erichie/overall-report">
            <button className="shop17-header-button">E riche Statistics</button> {/* Updated class name */}
          </Link>
        </div>
        <div className="shop17-center"> {/* Updated class name */}
          <h1 style={{fontSize:'3rem'}}><span style={{color:'orangered',fontSize:'3rem'}}>Mr.Computer Wizz </span>Admin Page</h1>
          <button className="btn btn-danger mt-2" onClick={handleSignOut}>Sign Out</button>
        </div>
        <div className="shop17-right"> {/* Updated class name */}
          <Link to="/shop17/admin/report">
            <button className="shop17-header-button">Sales Report</button> {/* Updated class name */}
          </Link>
        </div>
      </div>
      <div className="shop17-product-form"> {/* Updated class name */}
        <h2 style={{ textAlign: 'center' }}>Add a New Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="shop17-input-container"> {/* Updated class name */}
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

      <div className='shop17-container'> {/* Updated class name */}
        <h1 style={{ textAlign: 'center', marginTop: '50px', marginBottom: '50px' }} className='shop17-product-h1' >Products</h1> {/* Updated class name */}
        <input
          className='shop17-input-bar'
          type="text"
          placeholder="Search by Product Name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="shop17-product-list"> {/* Updated class name */}
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="shop17-product-card" 
              style={{
                marginLeft: index % productsPerRow === 0 ? '0' : '20px',
              }}
            >
              {editedProduct && editedProduct.id === product.id ? (
                <div className="shop17-editable-fields"> {/* Updated class name */}
                  <div className="shop17-field"> {/* Updated class name */}
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
                  <div className="shop17-field"> {/* Updated class name */}
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
                  <div className="shop17-field"> {/* Updated class name */}
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
                  <div className="shop17-field"> {/* Updated class name */}
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
                  <div className="shop17-field"> {/* Updated class name */}
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
                  <div key={product.id} className="shop17-product-details "> {/* Updated class name */}
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
                    <div className='shop17-btn'> {/* Updated class name */}
                      <button
                        className="shop17-edit-button" 
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="shop17-delete-button" 
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

