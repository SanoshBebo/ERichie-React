import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../products/ProductList.css"
import { Link } from "react-router-dom";

function ProductList() {
  const [product, setProduct] = useState({
    category: "Gaming",
    description: "",
    price: "",
    productname: "",
    shopid: "shop07", // Pre-defined shopname
    stock: "",
  });

  const [Products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products";

  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const firebaseStorageUrl =
    "https://firebasestorage.googleapis.com/v0/b/myapp-5dc30.appspot.com/o/images";

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split("/").pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((error) => {
        console.error("Error fetching products: ", error);
      });
  }, []);

  useEffect(() => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = Products.filter((product) =>
      product.fields.productname.stringValue.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchInput, Products]);

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = Products.filter((product) =>
      product.fields.productname.stringValue.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  };
  const handleEditProduct = (id) => {
    const productToEdit = Products.find((product) => product.id === id);
    if (productToEdit) {
      setIsEditing(true);
      setEditProductId(id);
      setProduct({
        category: productToEdit.fields?.category?.stringValue || "",
        description: productToEdit.fields?.description?.stringValue || "",
        price: productToEdit.fields?.price?.integerValue || "",
        productname: productToEdit.fields?.productname?.stringValue || "",
        shopid: productToEdit.fields?.shop?.stringValue || "",
        stock: productToEdit.fields?.stock?.integerValue || "",
      });
      setShowAddProductForm(true);
    }
  }
  
  const handleSaveEdit = async () => {
    const imageFile = product.imageurl;
    const imageName = encodeURIComponent(""); // URL-encode the image name
    const imageRef = `https://firebasestorage.googleapis.com/v0/b/myapp-5dc30.appspot.com/o/images/${imageName}?alt=media`;
  
    const payload = {
      fields: {
        category: { stringValue: product.category },
        description: { stringValue: product.description },
        price: { integerValue: parseInt(product.price) },
        productname: { stringValue: product.productname },
        shopid: { stringValue: product.shopid},
        stock: { integerValue: parseInt(product.stock, 10) },
        imageurl: { stringValue: imageRef },
      },
    };
  
    try {
      const imageUploadResponse = await axios.post(imageRef, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });
  
      if (imageUploadResponse.status === 200) {
        const productEditResponse = await axios.patch(`${apiUrl}/${editProductId}`, payload);
  
        if (productEditResponse.status === 200) {
          toast.success("Product edited successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
  
          // Update the product in the list
          const updatedProducts = Products.map((product) => {
            if (product.id === editProductId) {
              return {
                id: product.id,
                fields: payload.fields,
              };
            }
            return product;
          });
  
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setProduct({
            category: "Gaming",
            description: "",
            price: "",
            productname: "",
            shopid: "shop07",
            stock: "",
            imageurl: "",
          });
          setShowAddProductForm(false);
          setIsEditing(false);
          setEditProductId(null);
        } else {
          console.error("Error: Product edit failed");
        }
      } else {
        console.error("Error: Image upload failed");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  const handleAddProduct = async () => {
    const imageFile = product.imageurl;
    const imageName = imageFile.name;
    const imageRef =
      firebaseStorageUrl + "/" + encodeURIComponent(imageName) + "?alt=media";

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
    console.log(payload)
  
    try {
      const imageUploadResponse = await axios.post(imageRef, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });
  
      if (imageUploadResponse.status === 200) {
        const productAddResponse = await axios.post(apiUrl, payload);
        if (productAddResponse.status === 200) {
          toast.success("Product added successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
  
          const newProduct = {
            id: productAddResponse.data.name.split("/").pop(),
            fields: payload.fields,
          };
          const updatedProducts = [...Products, newProduct];
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setProduct({
            category: "Gaming",
            description: "",
            price: "",
            productname: "",
            shopid: "shop07",
            stock: "",
            imageurl: "",
          });
          setShowAddProductForm(false);
        } else {
          console.log("Error: Product addition failed");
        }
      } else {
        console.log("Error: Image upload failed");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/${id}`);
      if (response.status === 200) {
        toast.success("Product deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
  
        const updatedProducts = Products.filter(
          (product) => product.id !== id
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } else {
        console.error("Error: Product deletion failed");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProductId(null);
    setProduct({
      category: "Gaming",
      description: "",
      price: "",
      productname: "",
      shopid: "shop07",
      stock: "",
      imageurl: "",
    });
    setShowAddProductForm(false);
  };

  return (
    
    <div className="add-product-pages">
      <div className="navbar">
        <Link to="/shop07/admin">Go back</Link>
        <Link to="/admin/login">Logout</Link>
      </div>
      <div className="add-product-containers">
        <h1 className="add-product-heading">
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>
        <button
          className="toggle-form-button"
          onClick={() => setShowAddProductForm(!showAddProductForm)}
        >
          {showAddProductForm ? "Close" : "Add Product"}
        </button>

        {showAddProductForm && (
          
          <div className="product-forms">
            <div>
              <label>Category</label>
              <input type="text" value={product.category} disabled />
            </div>
            <div className="form-group">
              <div className="description-input">
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
                <label>Shop id:</label>
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
              <div className="edit-product-buttons">
                <button className="save-edit-button" onClick={handleSaveEdit}>
                  Save Edit
                </button>
                <button className="cancel-edit-button" onClick={handleCancelEdit}>
                  Cancel Edit
                </button>
              </div>
            ) : (
              <button className="add-product-button" onClick={handleAddProduct}>
                Add Product
              </button>
            )}
          </div>
        )}
      </div>
      <div className="product-lists">
        <div className="product-searches">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="product-container">
          {filteredProducts.map((product) => (
            <div className="product-cards" key={product.id}>
              <div className="product-items">
                <div className="product-images">
                  <img
                    src={product.fields.imageurl?.stringValue}
                    alt={product.fields.productname?.stringValue}
                  />
                </div>

                <div className="product-details-1">
                  <strong className="product-name">
                    {product.fields.productname?.stringValue}
                  </strong>
                  <p className="product-description">
                    {product.fields.description?.stringValue}
                  </p>
                </div>
                <div className="product-details-2">
                  <p className="product-price">
                    <strong>Price:</strong> Rs.{product.fields.price?.integerValue}
                  </p>
                  <p className="product-stock">
                    <strong>Stock:</strong> {product.fields.stock?.integerValue}
                  </p>
                  <div className="product-buttons-2">
                    <button
                      className="delete-product-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="edit-product-button"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position={toast.POSITION.TOP_RIGHT} />
    </div>
  );
}

export default ProductList;
