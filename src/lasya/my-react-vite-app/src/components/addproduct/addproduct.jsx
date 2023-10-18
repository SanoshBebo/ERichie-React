import "./addproduct.css";

import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../../../SanoshProject/redux/shopOneUserSlice";

function AddProduct() {
  const [product, setProduct] = useState({
    productname: "",

    price: "",

    description: "",

    stock: "",

    imageurl: null,
  });

  const [products, setProducts] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [editProductId, setEditProductId] = useState(null);


  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products";

  // Firebase Storage URL

  const storageUrl =
    "https://firebasestorage.googleapis.com/v0/b/gamestore-1b041.appspot.com/o";

  useEffect(() => {
    // Fetch the list of products from your API

    loadProducts();
  }, []);

  const editingFormRef = useRef(null);

  const handleAddProduct = async () => {
    const imageFile = product.imageFile;

    if (!imageFile) {
      toast.error("Please select an image", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    // Validate price and stock fields

    if (parseInt(product.price) < 1 || parseInt(product.stock) < 1) {
      toast.error("Price and stock cannot be negative", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    try {
      // Upload the image to Firebase Storage

      const response = await axios.post(
        `${storageUrl}/images%2F${encodeURIComponent(
          imageFile.name
        )}?alt=media`,

        imageFile,

        {
          headers: {
            "Content-Type": imageFile.type,
          },
        }
      );

      if (response.status === 200) {
        // Construct the image URL

        const imageurl = `${storageUrl}/images%2F${encodeURIComponent(
          imageFile.name
        )}?alt=media`;

        // Create a new product document with the image URL and additional fields

        const payload = {
          fields: {
            productname: { stringValue: product.productname },

            price: { integerValue: parseInt(product.price) },

            description: { stringValue: product.description },

            stock: { integerValue: parseInt(product.stock, 10) },

            shopid: { stringValue: "shop06" }, // Modify this as needed

            category: { stringValue: "gaming" }, // Modify this as needed

            imageurl: { stringValue: imageurl },
          },
        };

        const firestoreResponse = await axios.post(apiUrl, payload);

        if (firestoreResponse.status === 200) {
          toast.success("Product added successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });

          // Reset the form and reload the product list

          setProduct({
            productname: "",

            price: "",

            description: "",

            stock: "",

            imageFile: null,
          });

          loadProducts();
        } else {
          toast.error("Error: Product addition failed", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        toast.error("Error: Image upload failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error: ", error);

      toast.error("Error: Product addition failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const loadProducts = () => {
    // Fetch the list of products from your API

    axios

      .get(apiUrl)

      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split("/").pop(),

          fields: doc.fields,
        }));

        setProducts(productList);
      })

      .catch((error) => {
        console.error("Error fetching products: ", error);
      });
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/${id}`);

      if (response.status === 200) {
        toast.success("Product deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Reload the product list after deleting a product

        loadProducts();
      } else {
        toast.error("Error: Product deletion failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error: ", error);

      toast.error("Error: Product deletion failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleEditProduct = (id) => {
    const editedProduct = products.find((product) => product.id === id);

    setProduct({
      productname: editedProduct.fields.productname.stringValue,

      price: editedProduct.fields.price.integerValue,

      description: editedProduct.fields.description.stringValue,

      stock: editedProduct.fields.stock.integerValue,

      imageFile: null, // Clear the image file when editing
    });

    setEditProductId(id);

    setIsEditing(true);

    // Scroll to the editing form

    if (editingFormRef.current) {
      editingFormRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleSaveEdit = async () => {
    // Validate price and stock fields

    if (parseInt(product.price) < 0 || parseInt(product.stock) < 0) {
      toast.error("Price and stock cannot be negative", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    const payload = {
      fields: {
        productname: { stringValue: product.productname },

        price: { integerValue: parseInt(product.price) },

        description: { stringValue: product.description },

        stock: { integerValue: parseInt(product.stock, 10) },
      },
    };

    // Check if a new image file is selected

    if (product.imageFile) {
      try {
        // Upload the new image to Firebase Storage

        const imageResponse = await axios.post(
          `${storageUrl}/images%2F${encodeURIComponent(
            product.imageFile.name
          )}?alt=media`,

          product.imageFile,

          {
            headers: {
              "Content-Type": product.imageFile.type,
            },
          }
        );

        if (imageResponse.status === 200) {
          // Construct the new image URL

          const newImageUrl = `${storageUrl}/images%2F${encodeURIComponent(
            product.imageFile.name
          )}?alt=media`;

          // Update the product's imageUrl field with the new image URL

          payload.fields.imageurl = { stringValue: newImageUrl };
        } else {
          toast.error("Error: Image upload failed", {
            position: toast.POSITION.TOP_RIGHT,
          });

          return;
        }
      } catch (error) {
        console.error("Error uploading image: ", error);

        toast.error("Error: Image upload failed", {
          position: toast.POSITION.TOP_RIGHT,
        });

        return;
      }
    }

    try {
      const response = await axios.patch(`${apiUrl}/${editProductId}`, payload);

      if (response.status === 200) {
        toast.success("Product edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Reset the form and editing state, and reload the product list

        setIsEditing(false);

        setEditProductId(null);

        setProduct({
          productname: "",

          price: "",

          description: "",

          stock: "",

          imageFile: null,
        });

        loadProducts();
      } else {
        toast.error("Error: Product editing failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error: ", error);

      toast.error("Error: Product editing failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setEditProductId(null);

    setProduct({
      productname: "",

      price: "",

      description: "",

      stock: "",

      imageFile: null,
    });
  };


  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => { 
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "lasyaadmin@gmail.com") {
      if (userData.role == "admin") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

  return (
    <div>
      <div className="add-product-container">
        <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>

        <div className=" flex justify-center mb-3">
          <Link
            to="/shop06/admin/report"
            button
            className=" bg-blue-500 w-35 text-white font-bold  px-2 py-2 rounded-lg"
          >
            Report{" "}
          </Link>
        </div>

        <div className=" flex justify-center mb-3">
          <Link
            to="/shop06/admin/overall-report"
            button
            className=" bg-blue-500 w-35 text-white font-bold  px-2 py-2 rounded-lg"
          >
            E-Richie Report{" "}
          </Link>
        </div>

        <div ref={editingFormRef} className="product-form">
          <label>Product Name:</label>

          <input
            type="text"
            value={product.productname}
            onChange={(e) =>
              setProduct({ ...product, productname: e.target.value })
            }
          />

          <label>Price:</label>

          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />

          <label>Description:</label>

          <input
            type="text"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />

          <label>Stock:</label>

          <input
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          />

          <label>Image:</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProduct({ ...product, imageFile: e.target.files[0] })
            }
          />

          {isEditing ? (
            <div>
              <button onClick={handleSaveEdit}>Save Edit</button>

              <button onClick={handleCancelEdit}>Cancel Edit</button>
            </div>
          ) : (
            <button onClick={handleAddProduct}>Add Product</button>
          )}
        </div>
      </div>

      <div>
        <h2>Product List</h2>

        <ul>
          {products.map((product) => (
            <div className="product-box" key={product.id}>
              <strong>{product.fields.productname?.stringValue}</strong> - Rs.{" "}
              {product.fields.price?.integerValue}
              <p>{product.fields.description?.stringValue}</p>
              <p>Stock: {product.fields.stock?.integerValue}</p>
              <img
                className="product-image"
                src={product.fields.imageurl?.stringValue}
                alt={product.fields.productname?.stringValue}
              />
              <button
                className="product-button edit-button"
                onClick={() => handleEditProduct(product.id)}
              >
                Edit
              </button>
              <button
                className="product-button delete-button"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

export default AddProduct;
