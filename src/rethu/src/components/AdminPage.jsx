import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OverallReport from "../../../ERichie/OverallReport";
import { Link } from "react-router-dom";

function AddProduct() {
  const [product, setProduct] = useState({
    category: "Gaming",
    description: "",
    modelNo: "",
    price: "",
    productname: "",
    shopname: "shop05", // Pre-defined shopname
    stock: "",
  });

  const [Products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products";

  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const firebaseStorageUrl =
    "https://firebasestorage.googleapis.com/v0/b/dead-eye-game-store.appspot.com/o";

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

  const handleAddProduct = async () => {
    const imageFile = product.imageurl;
    const imageName = imageFile.name;
    const imageRef =
      firebaseStorageUrl + "/" + encodeURIComponent(imageName) + "?alt=media";

    const payload = {
      fields: {
        category: { stringValue: product.category },
        description: { stringValue: product.description },
        modelNo: { stringValue: product.modelNo },
        price: { integerValue: parseInt(product.price) },
        productname: { stringValue: product.productname },
        shopname: { stringValue: product.shopname },
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
            modelNo: "",
            price: "",
            productname: "",
            shopname: "shop05",
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
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
          console.log("Error: Product deletion failed");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  const DeadEyeInventory = () => {
    window.location.href = "/shop05/admin/Dead_eye_Inventory";
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProductId(null);
    setProduct({
      category: "Gaming",
      description: "",
      modelNo: "",
      price: "",
      productname: "",
      shopname: "shop05",
      stock: "",
      imageurl: "",
    });
    setShowAddProductForm(false);
  };

  return (
    <div className="add-product-pages">
      <div className="add-product-containers">
        <button className="inventory-button" onClick={() => DeadEyeInventory()}>
          Dead_eye_Inventory
        </button>
        <Link to="/shop05/admin/overall-report">Overall Report</Link>
        <h1 className="add-product-heading">
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>
        <button
          className="toggle-form-button"
          onClick={() => setShowAddProductForm(!showAddProductForm)}
        >
          {showAddProductForm ? "Close Form" : "Add Product"}
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
                <label>Model No:</label>
                <input
                  type="text"
                  value={product.modelNo}
                  onChange={(e) =>
                    setProduct({ ...product, modelNo: e.target.value })
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
                <input type="text" value={product.shopname} disabled />
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
        <h2 className="ProductListName">Product List</h2>
        <div className="product-searches">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <ul>
          {filteredProducts.map((product) => (
            <div className="product-items" key={product.id}>
              <div className="product-cards">
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
                    <strong>Price:</strong> ${product.fields.price?.integerValue}
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
        </ul>
      </div>
      <ToastContainer position={toast.POSITION.TOP_RIGHT} />
    </div>
  );
}

export default AddProduct;
