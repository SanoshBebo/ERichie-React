import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { toast } from 'react-toastify';

import Nav from '../navigation/navbar';

import 'react-toastify/dist/ReactToastify.css';

import './CSS/ViewProduct.css';

 

const ProductDetail = ({ product, onUpdate, onDelete }) => {

  const [isEditing, setIsEditing] = useState(false);

  const [editedProduct, setEditedProduct] = useState({ ...product });

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

 

  useEffect(() => {

    setEditedProduct({ ...product });

  }, [product]);

 

  const handleEditClick = () => {

    setIsEditing(true);

  };

 

  const handleCancelClick = () => {

    setIsEditing(false);

    setEditedProduct({ ...product });

  };

 

  const handleUpdateClick = async () => {

    try {

      toast.success('Product updated successfully!');

      await onUpdate(editedProduct);

      window.location.reload();

    } catch (error) {

      console.error('Error updating product:', error);

    }

  };

 

  const handleDeleteClick = () => {

    setShowDeleteConfirmation(true);

  };

 

  const handleDeleteConfirm = async () => {

    try {

      toast.success('Product deleted successfully!');

      await onDelete(product);

      window.location.reload();

    } catch (error) {

      console.error('Error deleting product:', error);

    }

  };

 

  const handleDeleteCancel = () => {

    setShowDeleteConfirmation(false);

  };

 

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setEditedProduct({ ...editedProduct, [name]: value });

  };

 

  return (

    <section className='Product'>

      <div className={`product-detail ${isEditing ? 'editing' : ''}`}>

        <h2 className="product-title">{editedProduct.productname}</h2>

        <p className="product-description">Description: {editedProduct.description}</p>

        <p className="product-price">Price: ${editedProduct.price}</p>

        <img

          src={editedProduct.imageurl}

          alt={`Image for ${editedProduct.productname}`}

          className="product-image"

          onError={(e) => {

            e.target.src = 'fallback.jpg';

          }}

        />

        <p className="product-stock">Stock: {editedProduct.stock}</p>

        {isEditing ? (

          <div className="edit-form">

            <input

              type="text"

              name="productname"

              value={editedProduct.productname}

              onChange={handleInputChange}

              className="form-input"

            />

            <input

              type="text"

              name="description"

              value={editedProduct.description}

              onChange={handleInputChange}

              className="form-input"

            />

            <input

              type="number"

              name="price"

              value={editedProduct.price}

              onChange={handleInputChange}

              className="form-input"

            />

            <input

              type="number"

              name="stock"

              value={editedProduct.stock}

              onChange={handleInputChange}

              className="form-input"

            />

            <input

              type="text"

              name="shopid"

              value={editedProduct.shopid}

              onChange={handleInputChange}

              className="form-input"

              disabled

            />

            <input

              type="text"

              name="category"

              value={editedProduct.category}

              onChange={handleInputChange}

              className="form-input"

              disabled

            />

            <button onClick={handleUpdateClick} className="update-button">

              Update

            </button>

            <br />

            <br />

            <button onClick={handleCancelClick} className="cancel-button">

              Cancel

            </button>

          </div>

        ) : (

          <div className="buttons">

            <button onClick={handleEditClick} className="edit-button">

              Edit

            </button>

            <button onClick={handleDeleteClick} className="delete-button">

              Delete

            </button>

          </div>

        )}

 

        {showDeleteConfirmation && (

          <div className="confirmation-modal">

            <p>Are you sure you want to delete this product?</p>

            <button onClick={handleDeleteConfirm} className="confirm-delete-button">

              Confirm

            </button>

            <button onClick={handleDeleteCancel} className="cancel-delete-button">

              Cancel

            </button>

          </div>

        )}

      </div>

    </section>

  );

};

 

const ProductForm = () => {

  const [products, setProducts] = useState([]);

  const [originalProducts, setOriginalProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

 

  useEffect(() => {

    fetchProducts();

  }, []);

 

  useEffect(() => {

    const filteredProducts = originalProducts.filter((product) =>

      product.productname.toLowerCase().includes(searchTerm.toLowerCase())

    );

    setProducts(filteredProducts);

  }, [searchTerm, originalProducts]);

 

  const fetchProducts = async () => {

    try {

      const apiKey = "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ";

      const response = await axios.get(

        `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products?key=${apiKey}`

      );

 

      const productsData = response.data.documents.map((doc) => {

        const data = doc.fields;

        const documentID = doc.name.split('/').pop();

        const productname = data && data.productname && data.productname.stringValue ? data.productname.stringValue : "No name available";

        const description = data && data.description && data.description.stringValue ? data.description.stringValue : "No description available";

        const price = data && data.price && data.price.integerValue ? data.price.integerValue : 0;

        const imageurl = data && data.imageurl && data.imageurl.stringValue ? data.imageurl.stringValue : "No image available";

        const stock = data && data.stock && data.stock.integerValue ? data.stock.integerValue : 50;

        const shopid = data && data.shopid && data.shopid.stringValue ? data.shopid.stringValue : "No shop ID available";

        const category = data && data.category && data.category.stringValue ? data.category.stringValue : "No category available";

 

        return {

          documentID,

          productname,

          description,

          price,

          imageurl,

          stock,

          shopid,

          category

        };

      });

 

      setProducts(productsData);

      setOriginalProducts(productsData);

    } catch (error) {

      console.error('Error fetching products:', error);

    }

  };

 

  const handleUpdateProduct = async (updatedProduct) => {

    try {

      const apiKey = "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ";

      const documentID = updatedProduct.documentID;

      const updateData = {

        fields: {

          productname: { stringValue: updatedProduct.productname },

          description: { stringValue: updatedProduct.description },

          price: { integerValue: updatedProduct.price },

          imageurl: { stringValue: updatedProduct.imageurl },

          stock: { integerValue: updatedProduct.stock },

          shopid: { stringValue: updatedProduct.shopid },

          category: { stringValue: updatedProduct.category },

        },

      };

 

      await axios.patch(

        `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products/${documentID}?key=${apiKey}`,

        updateData

      );

 

      const updatedProducts = products.map((product) =>

        product.documentID === documentID ? updatedProduct : product

      );

      setProducts(updatedProducts);

      setSelectedProduct(updatedProduct);

    } catch (error) {

      console.error('Error updating product:', error);

    }

  };

 

  const handleDeleteProduct = async (productToDelete) => {

    try {

      const apiKey = "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ";

      const documentID = productToDelete.documentID;

 

      await axios.delete(

        `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products/${documentID}?currentDocument.exists=true&key=${apiKey}`

      );

 

      const updatedProducts = products.filter((product) => product.documentID !== documentID);

      setProducts(updatedProducts);

      setSelectedProduct(null);

    } catch (error) {

      console.error('Error deleting product:', error);

    }

  };

 

  const handleProductNameClick = (product) => {

    toast.success('Product Selected.Please Scroll Down To edit!');

 

    setSelectedProduct(product);

  };

 

  return (

    <section className='productcheckoutlist'>

      <Nav />

      <div className="productcheckoutlistcontainer">

        <div className="row justify-content-center">

          <div className="col-md-8">

            <h2 className="text-center">View Products</h2>

            <div className="search-box">

              <input

                type="text"

                className="search-input"

                placeholder="Search by Product Name"

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

              />

            </div>

            <ul className="product-list">

              {products.map((product, index) => (

                <li key={index} className="product-item">

                  <a

                    href="#"

                    className="product-link"

                    onClick={() => {

                      handleProductNameClick(product);

                      window.scrollTo(0, 0); // Scroll to the top of the page

                    }}

                  >

                    {product.productname}

                  </a>

                </li>

              ))}

            </ul>

            {selectedProduct && (

              <ProductDetail

                product={selectedProduct}

                onUpdate={handleUpdateProduct}

                onDelete={handleDeleteProduct}

              />

            )}

          </div>

        </div>

      </div>

    </section>

  );

 

};

 

export default ProductForm;