
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch,AiOutlineShoppingCart } from 'react-icons/ai';
import { CenterFocusStrong } from "@mui/icons-material";

function AddProduct() {
  const [product, setProduct] = useState({
    category: 'computer',
    description: '',
    modelNo: '',
    price: '',
    productname: '',
    shopid: 'shop16',
    stock: '',
  });

  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const apiUrl = 'https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products';
  
  
  const [currentCategory, setCurrentCategory] = useState('All'); // Default category is All
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const firebaseStorageUrl = 'https://firebasestorage.googleapis.com/v0/b/d-richie-computers.appspot.com/o';

  
  useEffect(() => {
    axios.get(apiUrl).then((response) => {
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
    const filteredBySearch = products.filter((product) =>
      product.fields.productname?.stringValue?.toLowerCase().includes(searchTerm)
    );  
    let filteredByCategory;
    if (currentCategory === 'All') {
      filteredByCategory = filteredBySearch;
    } else {
      filteredByCategory = filteredBySearch.filter((product) =>
        product.fields.modelNo?.stringValue?.startsWith(currentCategory)
      );
    }
  
    setFilteredProducts(filteredByCategory);
  }, [searchInput, products, currentCategory]);
  
  
  
    const handleSearch = () => {
      const searchTerm = searchInput.toLowerCase();
      const filtered = products.filter((product) =>
        product.fields.productname?.stringValue
          ?.toLowerCase()
          .includes(searchTerm)
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
        modelNo: { stringValue: product.modelNo },
        price: { integerValue: parseInt(product.price) },
        productname: { stringValue: product.productname },
        shopid: { stringValue: product.shopid },
        stock: { integerValue: parseInt(product.stock, 10) },
        imageurl: { stringValue: imageRef },
      },
    };

    try {
      const imageUploadResponse = await axios.post(imageRef, imageFile, {
        headers: {
          'Content-Type': imageFile.type,
        },
      });

      if (imageUploadResponse.status === 200) {
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
            modelNo: '',
            price: '',
            productname: '',
            shopid: 'shop16',
            stock: '',
            imageurl: '',
          });
          setShowAddProductForm(false);
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
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/${id}`);
        if (response.status === 200) {
          const updatedProducts = products.filter((product) => product.id !== id);
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
        } else {
          console.log('Error: Product deletion failed');
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    }
    const response = await axios.delete(`${apiUrl}/${id}`);
        if (response.status === 200) {
          const updatedProducts = products.filter((product) => product.id !== id);
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          toast.success('Product deleted successfully!', {
            position: 'top-right',
            autoClose: 3000, // Time in milliseconds to keep the toast open
          });
        } else {
          toast.error('Error in deleting the product!', {
            position: 'top-right',
            autoClose: 3000, // Time in milliseconds to keep the toast open
          });
        }
    
  };

  const handleEditProduct = (id) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const editedProduct = products.find((product) => product.id === id);
    setProduct({
      category: 'computer',
      description: editedProduct.fields.description.stringValue,
      modelNo: editedProduct.fields.modelNo.stringValue,
      price: editedProduct.fields.price.integerValue,
      productname: editedProduct.fields.productname.stringValue,
      shopid: 'shop16', // Pre-defined shopid
      stock: editedProduct.fields.stock.integerValue,
      imageurl: editedProduct.fields.imageurl.stringValue,
    });
    setEditProductId(id);
    setIsEditing(true);
    setShowAddProductForm(true);
  };

  const handleSaveEdit = async () => {
    const imageFile = product.imageurl;
    const imageName = imageFile.name;
    const imageRef = firebaseStorageUrl + '/' + encodeURIComponent(imageName) + '?alt=media';

    const payload = {
      fields: {
        category: { stringValue: 'computer' },
        description: { stringValue: product.description },
        modelNo: { stringValue: product.modelNo },
        price: { integerValue: parseInt(product.price) },
        productname: { stringValue: product.productname },
        shopid: { stringValue: 'shop16' }, // Pre-defined shopid
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
        const productUpdateResponse = await axios.patch(`${apiUrl}/${editProductId}`, payload);
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
            modelNo: '',
            price: '',
            productname: '',
            shopid: 'shop16',
            stock: '',
            imageurl: '',
          });
          setShowAddProductForm(false);
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
      category: 'computer',
      description: '',
      modelNo: '',
      price: '',
      productname: '',
      shopid: 'shop16',
      stock: '',
      imageurl: '',
    });
    setShowAddProductForm(false);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  return (
    <section className='dhanushiya'>
      <div className='admin-page'>
        <nav className="navbar">
          <h1>Dhanu Computers!</h1>
          <ul className="navbar-list">
            
            <li><Link to="/Shop16/Daily_Inventoryreport">Daily Inventory</Link></li>
            <li><Link to='/erichie/' className='link'>Overall Report</Link></li>
            <li><button >Signout</button></li>
          </ul>
        </nav>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="add-product-pages">
          <div className="add-product-containers">
            <h1 id="editdelname">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
            {/* Button to toggle the "Add Product" form */}
            <br></br>
            <br></br>
            <button id="opencloseform" onClick={() => setShowAddProductForm(!showAddProductForm)}>
              {showAddProductForm ? 'Close Form' : 'Add Product'}
            </button>
<br></br>
            {/* "Add Product" form */}
            {showAddProductForm && (
              <div className="product-forms">
                <div>
                    <label>Product Name:</label>
                    <input type="text" value={product.productname} onChange={(e) => setProduct({ ...product, productname: e.target.value })} />
                  </div>
                <div>
                  <label>Category</label>
                  <input type="text" value={product.category} disabled />
                </div>
                
                  <div className="description-input">
                    <label>Description:</label>
                    <input type="text" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label>Model No:</label>
                    <input type="text" value={product.modelNo} onChange={(e) => setProduct({ ...product, modelNo: e.target.value })} />
                  </div>
                  <div>
                    <label>Price:</label>
                    <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                  </div>
                  
                  <div>
                    <label>Shop Name:</label>
                    <input type="text" value={product.shopid} disabled />
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
                    <button className="button save-button" onClick={handleSaveEdit}>Save Edit</button>
                    <button className="button cancel-button" onClick={handleCancelEdit}>Cancel Edit</button>
                  </div>
                ) : (
                  <button className="button" onClick={handleAddProduct}>Add Product</button>
                )}
              </div>
            )}
          </div>
          <div className="product-lists">
            {/* <h1 className="ProductListName">product</h1> */}
            <div className='search_options'>
    <div className="search-bar">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search for brand"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button id="search-button" onClick={handleSearch}>Search</button>
              </div>
              <select className="category-dropdown" onChange={(e) => handleCategoryChange(e.target.value)}>
  <option value="All">All</option>
  <option value="LAP">Laptops</option>
  <option value="COM">Computers</option>
  <option value="SSD">SSD</option>
  <option value="PRI">Printers</option>
  <option value="MBD">MotherBoard</option>
  <option value="CPU">CPU</option>
</select> 
                </div>
            <ul>
              {currentProducts.map((product) => (
                <div className="product-items" key={product.id}>
                  <div className="product-cards">
                    <div className="product-images">
                      <img
                        src={product.fields.imageurl?.stringValue}
                        alt={product.fields.productname?.stringValue}
                      />
                    </div>

                    <div className="product-details-1">
                      <strong>{product.fields.productname?.stringValue}</strong>
                      {/* <p><strong>Description:</strong></p> */}
                      <p>{product.fields.description?.stringValue}</p>
                    </div>
                    <div className="product-details-2">
                      <p><strong>Price:</strong> Rs.{product.fields.price?.integerValue}</p>
                      <p><strong>Stock:</strong> {product.fields.stock?.integerValue}</p>
                      <div className="product-buttons-2">
                        <button id="opencloseform" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        <button id="opencloseform" onClick={() => handleEditProduct(product.id)}>Edit</button>
                      </div>

                    </div><hr />
                  </div>
                </div>
              ))}
            </ul>
            
          </div>
        </div></div>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={productsPerPage}
          totalItemsCount={filteredProducts.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
        <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023 Dhanu Computers, Inc. All rights reserved.</p>
          <p>2nd floor , work easy space solutions, Urban Square, S.F No; 278/3A & 9A Kandanchavadi, Rajiv Gandhi Salai, Chennai, 600041</p>
        </div>
      </footer>
    </section>
  );
}

export default AddProduct;
