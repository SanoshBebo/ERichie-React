import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../SanoshProject/redux/shopOneUserSlice';
function AddProduct() {
  const [product, setProduct] = useState({
    category: 'computer',
    description: '  ',
    price: '',
    productname: '',
    shopid: 'shop14', // Pre-defined shopname
    stock: '',
  });

  const handleSignOut = () => {

    localStorage.removeItem("user");
    
    navigate("/admin/login");
    
    };
    
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // Control the visibility of the "Add Product" form
  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products';
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const firebaseStorageUrl =
    'https://firebasestorage.googleapis.com/v0/b/digig-57d5f.appspot.com/o';

    const user = useSelector((state) => state.shoponeuser.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoadingUser, setIsLoadingUser] = useState(true);


    useEffect(() => {
      if (!isLoadingUser && user.length === 0) {
        navigate("/admin/login");
      }
    }, [isLoadingUser, user, navigate]);
  
    useEffect(() => { 
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.email == "sundariadmin@gmail.com") {
        if (userData.role == "customer") {
          navigate("/admin/login");
        }
        dispatch(setUser(userData));
      }
      setIsLoadingUser(false);
    }, []);
    
    

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, []);
  useEffect(() => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname.stringValue.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchInput, products]);
  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname.stringValue.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  };
  const handleAddProduct = async () => {
    const imageFile = product.imageurl;
    const imageName = imageFile.name;
    const imageRef =
      firebaseStorageUrl + '/' + encodeURIComponent(imageName) + '?alt=media';
    const payload = {
      fields: {
        category: { stringValue: product.category },
        description: { stringValue: product.description },
        price: { integerValue: parseInt(product.price) },
        productname: { stringValue: product.productname },
        shopid: { stringValue: product.shopid },
        stock: { integerValue: parseInt(product.stock, 10) },
        imageurl: { stringValue: imageRef },
      },
    };
    try {
      // Upload the image to Firebase Storage
      const imageUploadResponse = await axios.post(imageRef, imageFile, {
        headers: {
          'Content-Type': imageFile.type,
        },
      });
      if (imageUploadResponse.status === 200) {
        // Image uploaded successfully, now add the product
        const productAddResponse = await axios.post(apiUrl, payload);
        if (productAddResponse.status === 200) {
          const newProduct = {
            id: productAddResponse.data.name.split('/').pop(),
            fields: payload.fields,
          };

          const updatedProducts = [...products, newProduct];
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setProduct({
            category: 'computer',
            description: '',
            price: '',
            productname: '',
            shopid: 'shop14',
            stock: '',
            imageurl: '',
          });

          setShowAddProductForm(false); // Close the form after adding a product

        } else {
          console.log('Error: Product addition failed');
        }
      } else {
        console.log('Error: Image upload failed');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/${id}`);
        if (response.status === 200) {
          const updatedProducts = products.filter((product) => product.id !== id);
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
        }
        else {
          console.log('Error: Product deletion failed');
        }
      }
      catch (error) {
        console.error('Error: ', error);
      }
    }
  };
  const handleEditProduct = (id) => {
    const editedProduct = products.find((product) => product.id === id);
    setProduct({
      category: 'computer',
      description: editedProduct.fields.description.stringValue,
      price: editedProduct.fields.price.integerValue,
      productname: editedProduct.fields.productname.stringValue,
      shopid: 'shop14', // Pre-defined shopname
      stock: editedProduct.fields.stock.integerValue,
      imageurl: editedProduct.fields.imageurl.stringValue,
    });
    setEditProductId(id);
    setIsEditing(true);
    setShowAddProductForm(true); // Show the "Add Product" form when editing
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  };

  const handleSaveEdit = async () => {
    const imageFile = product.imageurl;
    const imageName = imageFile.name;
    const imageRef =
      firebaseStorageUrl + '/' + encodeURIComponent(imageName) + '?alt=media';
    const payload = {
      fields: {
        category: { stringValue: 'computer' },
        description: { stringValue: product.description },
        price: {integerValue: parseInt(product.price) },
        productname: { stringValue: product.productname },
        shopid: { stringValue: 'Shop14' }, // Pre-defined shopname
        stock: { integerValue: parseInt(product.stock, 10) },
        imageurl: { stringValue: imageRef },
      },
    };
    try {
      // Upload the new image to Firebase Storage
      const imageUploadResponse = await axios.post(imageRef, imageFile, {
        headers: {
          'Content-Type': imageFile.type,
        },
      });
      if (imageUploadResponse.status === 200) {
        // Image uploaded successfully, now update the product
        const productUpdateResponse = await axios.patch(
          `${apiUrl}/${editProductId}`,
          payload
        );
        if (productUpdateResponse.status === 200) {
          const updatedProducts = products.map((p) =>
            p.id === editProductId ? { ...p, fields: payload.fields } : p
          );
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setIsEditing(false);
          setEditProductId(null);
          setProduct({
            category: 'computer',
            description: '',
            price: '',
            productname: '',
            shopid: 'shop14',
            stock: '',
            imageurl: '',
          });
          setShowAddProductForm(false); // Close the form after saving edit
        } else {
          console.log('Error: Product editing failed');
        }
      } else {
        console.log('Error: Image upload failed');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProductId(null);
    setProduct({
      category: 'Comuters',
      description: '',
      price: '',
      productname: '',
      shopid: 'shop14',
      stock: '',
      imageurl: '',
    });
    setShowAddProductForm(false); // Close the form when canceling edit
  };
  const handleShowStatistics = () => {
    // Implement the logic to show statistics, e.g., display a modal or navigate to a statistics page.
    // You can use state to control the visibility of the statistics component.
    // Example:
    // setStatisticsVisible(true);
  };
  return (
    <section className='sundarishop14'>
    <div className="add-product-pages_shop14">
      <div className="add-product-containers_shop14">
        <h1><b>{'Digital Genie'}</b></h1>
        
        {/* Button to toggle the "Add Product" form */}
        <button onClick={() => setShowAddProductForm(!showAddProductForm)}>
          {showAddProductForm ? 'Close Form' : 'Add Product'}
        </button>
        {/* Add the "Statistics" button */}
        <button className="statistics-button" onClick={() => navigate('/shop14/admin/report')}>
  Statistics
</button>
<button className="statistics-button" onClick={() => navigate('/erichie/overall-report')}>
  e-Richie Report
</button>
<button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
        {/* "Add Product" form */}
        {showAddProductForm && (
          <div className="product-forms_shop14">
            <div>
              <label>Category</label>
              <input
                type="text"
                value={product.category}
                disabled
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>
            <div>
              <label>Product Name:</label>
              <input
                type="text"
                value={product.productname}
                onChange={(e) =>
                  setProduct({ ...product, productname: e.target.value })
                }
              />
            </div>
            <div>
              <label>Shop Name:</label>
              <input
                type="text"
                value={product.shopid}
                disabled
              />
            </div>
            <div>
              <label>Stock:</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
            </div>
            <div>
              <label>Image File:</label>
              <input
                type="file"
                onChange={(e) =>
                  setProduct({ ...product, imageurl: e.target.files[0] })
                }
              />
            </div>
            {isEditing ? (
              <div>
                <button onClick={handleSaveEdit}>Save Edit</button>
                <button onClick={handleCancelEdit}>Cancel Edit</button>
              </div>
            ) : (
              <button onClick={handleAddProduct}>Add Product</button>
            )}
          </div>
        )}
      </div>
      <div className="product-lists_shop14">
        <h2 className="ProductListName">Product List</h2>
        <div className="product-search_shop14">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul>
          {filteredProducts.map((product) => (
            <div className="product-items_shop14" key={product.id}>
              <div className="product-cards_shop14">
                <div className="product-images_shop14">
                  <img
                    src={product.fields.imageurl?.stringValue}
                    alt={product.fields.productname?.stringValue}
                  />
                </div>
                <div className="product-details-1_shop14">
                  <strong>{product.fields.productname?.stringValue}</strong>
                  <p><strong>Description:</strong></p>
                  <p><strong>{product.fields.description?.stringValue}</strong></p>
                  <p><strong>Price: ₹{product.fields.price?.integerValue}</strong></p>
                  <p><strong>Stock: {product.fields.stock?.integerValue}</strong></p>
                  <div className="product-buttons-2_shop14">
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                  </div>
                 
                </div>
              </div>
            </div>
          ))}
           
        </ul>
      </div>
    </div>
    </section>
  );
}
export default AddProduct;