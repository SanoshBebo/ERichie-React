import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../SanoshProject/redux/shopOneUserSlice";

function ImageUpload({ onImageUpload }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const handleSignOut = () => {

    localStorage.removeItem("user");

    navigate("/admin/login");

  };

  const handleImageUpload = async () => {
    if (image) {
      const storageUrl = `https://firebasestorage.googleapis.com/v0/b/lemontech-67162.appspot.com/o/${image.name}?alt=media`;
      const formData = new FormData();
      formData.append("file", image);

      try {
        const response = await axios.post(storageUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success('Image uploaded successfully', { position: toast.POSITION.TOP_RIGHT  });
        onImageUpload(storageUrl); // Pass the uploaded image URL to the parent component
      } catch (error) {
        
        console.error("Error uploading image:", error);
        toast.error('Error uploading image:', { position: toast.POSITION.TOP_RIGHT  });
      }
    }
  };

  return (
    
    <div className="image-upload-container mb-8">
       <div className="absolute top-0 right-0 mt-4 mr-4 space-x-4">
  <Link to="/shop10/adminhome">
    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center">Go Home</button>
  </Link>
  <button
    to="/shop10/admin/report"
    className="bg-blue-500 hover-bg-blue-700 text-white py-2 px-4 rounded-lg text-center"
    onClick={handleSignOut}
  >
    Sign Out
  </button>
</div>
      <label className="block text-gray-700 font-bold mb-2">Upload Image</label>
      <input
        type="file"
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
      >
        Choose File
      </label>
      {image && (
        <button
          onClick={handleImageUpload}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded ml-2 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Upload
        </button>
      )}
    </div>
  );
}

function AddProducts() {
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
    if (userData && userData.email == "sprityadmin@gmail.com") {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

  const [product, setProduct] = useState({
    productname: "",
    description: "",
    imageurl: "",
    price: "",
    stock: 0,
    type: "",
    shopid: "shop10",
    category: "mobile", // New field for product type
  });

  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products";

  const handleAddProduct = async () => {
    // Validate required fields
    if (!product.productname.trim() || !product.price.trim() || !product.description.trim()) {
      console.error("Please provide valid details.");
      window.confirm ("Please provide valid details")
      return;

    }
    if (product.stock < 0) {
      toast.error('Stock cannot be negative :', { position: toast.POSITION.TOP_RIGHT  });;
      return;
    }
    if (product.price < 0) {
      toast.error('Price cannot be negative :', { position: toast.POSITION.TOP_RIGHT  });;
      return;
    }
    // Create the payload with all fields
    const payload = {
      fields: {
        productname: { stringValue: product.productname },
        description: { stringValue: product.description },
        imageurl: { stringValue: product.imageurl },
        price: { integerValue: product.price },
        stock: { integerValue: product.stock },
        type: { stringValue: product.type },
        shopid: { stringValue: "shop10" },
        category: { stringValue: "mobile" }, // Include product type in payload
      },
    };

    try {
      const response = await axios.post(apiUrl, payload);

      if (response.status === 200) {
        console.log("Product added successfully.");
        toast.success('Product added successfully', { position: toast.POSITION.TOP_RIGHT  });
      } else {
        console.error("Error adding product. Response:", response);
        toast.error('Error adding product :', { position: toast.POSITION.TOP_RIGHT  });;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error('Error adding product :', { position: toast.POSITION.TOP_RIGHT  });;
    }
  };

  const handleImageUpload = (imageUrl) => {
    // Set the uploaded image URL in the product state
    setProduct({ ...product, imageurl: imageUrl });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-center">Add Product</h1>
      <div className="product-form bg-white p-6 rounded-lg shadow-md mx-auto max-w-lg">
        <label
          htmlFor="productname"
          className="block text-gray-700 font-bold mb-2"
        >
          Product Name:
        </label>
        <input
          type="text"
          id="productname"
          value={product.productname}
          onChange={(e) =>
            setProduct({ ...product, productname: e.target.value })
          }
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-primary-color"
        />
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description:
        </label>
        <input
          type="text"
          id="description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-primary-color"
        />
        <ImageUpload onImageUpload={handleImageUpload} />
        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
          Price:
        </label>
        <input
          type="number"
          id="price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-primary-color"
        />
        <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">
          Stock:
        </label>
        <input
          type="number"
          id="stock"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-primary-color"
        />
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Product Type:
        </label>
        <select
          id="type"
          value={product.type}
          onChange={(e) => setProduct({ ...product, type: e.target.value })}
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-primary-color"
        >
          <option value="">Select Type</option>
          <option value="mobile">Mobile</option>
          <option value="case">Case</option>
        </select>
        <button
          onClick={handleAddProduct}
          className="bg-primary-color text-white py-2 px-4 rounded mt-4 hover:bg-primary-color-dark focus:outline-none"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

export default AddProducts;
