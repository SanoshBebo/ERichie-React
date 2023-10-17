import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
import { User } from "lucide-react";
import { Box, Modal, TextField, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddProductForm = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    productname: "",
    description: "",
    stock: 0,
    price: 0,
    shopid: "shop03",
    category: "media",
    productid: "",
    imageurl: "",
  });

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [displayImage, setDisplayImage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));
    if (
      userdata.role == "shopkeeper" &&
      userdata.email == "vishaladmin@gmail.com"
    ) {
      async function fetchProducts() {
        try {
          const baseUrl =
            "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";
          const collectionName = "Products";
          const apiUrl = `${baseUrl}/${collectionName}`;
          const response = await axios.get(apiUrl);

          if (response.status === 200) {
            const productsData = response.data.documents.map((doc) => {
              const fields = doc.fields;
              return {
                id: doc.name.split("/").pop(),
                description: fields.description.stringValue,
                stock: fields.stock.integerValue,
                price: fields.price.integerValue,
                productname: fields.productname.stringValue,
                shopid: fields.shopid.stringValue,
                category: fields.category.stringValue,
                imageurl: {
                  value: fields.imageurl.stringValue,
                  uploadButton: "Upload Image",
                },
              };
            });
            setProducts(productsData);
            setFilteredProducts(productsData); 
          } else {
            console.error("Error fetching products:", response.statusText);
            console.error("Response data:", response.data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
      fetchProducts();
    } else {
      navigate("/admin/login");
    }
  }, [navigate])
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const storageBucket = "about-me-bf7ef.appspot.com";
      const storageRef = `products/${file.name}`;
      const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(
        storageRef
      )}?alt=media`;

      const imageFormData = new FormData();
      imageFormData.append("file", file);

      axios
        .post(storageUrl, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("Image uploaded successfully:", response.data);
            setProductData({
              ...productData,
              imageurl: storageUrl,
            });
            setDisplayImage(true);
          } else {
            console.error("Error uploading image:", response.statusText);
            console.error("Response data:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !productData.productname ||
      !productData.description ||
      !productData.stock ||
      !productData.price ||
      !productData.imageurl
    ) {
      alert("Please fill in all the fields.");
      return;
    }
    try {
      const baseUrl =
        "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";
      const collectionName = "Products";
      const apiUrl = selectedProductId
        ? `${baseUrl}/${collectionName}/${selectedProductId}`
        : `${baseUrl}/${collectionName}`;
      const hasNewImage =
        productData.imageurl !==
        products.find((p) => p.id === selectedProductId)?.imageurl.value;
      const payload = {
        fields: {
          description: { stringValue: productData.description },
          stock: { integerValue: parseInt(productData.stock, 10) },
          price: { integerValue: parseInt(productData.price, 10) },
          productname: { stringValue: productData.productname },
          shopid: { stringValue: productData.shopid },
          category: { stringValue: productData.category },
          imageurl: {
            stringValue: hasNewImage
              ? productData.imageurl
              : products.find((p) => p.id === selectedProductId)?.imageurl
                  .value,
          },
        },
      };

      const response = selectedProductId
        ? await axios.patch(apiUrl, payload)
        : await axios.post(apiUrl, payload);

      if (response.status === 200) {
        console.log(
          selectedProductId
            ? "Product updated successfully:"
            : "New product added successfully:",
          response.data
        );
        setProductData({
          productname: "",
          description: "",
          stock: 0,
          price: 0,
          shopid: "shop03",
          category: "media",
          productid: "",
          imageurl: "",
        });
        setSelectedProductId(null);
        refreshProductList();
        setDisplayImage(false);
        toast.success(
          selectedProductId
            ? "Product updated successfully"
            : "New product added successfully"
        );
      } else {
        console.error(
          selectedProductId
            ? "Error updating product:"
            : "Error adding new product:",
          response.statusText
        );
        console.error("Response data:", response.data);
        toast.error(
          selectedProductId
            ? "Error updating product"
            : "Error adding new product"
        );
      }
    } catch (error) {
      console.error(
        selectedProductId
          ? "Error updating product:"
          : "Error adding new product:",
        error
      );
      toast.error(
        selectedProductId
          ? "Error updating product"
          : "Error adding new product"
      );
    }
  };
  useEffect(() => {
    // When the search term changes, filter the products
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    console.log(productToEdit);
    if (productToEdit) {
      setProductData({
        ...productData,
        description: productToEdit.description,
        stock: productToEdit.stock,
        price: productToEdit.price,
        productname: productToEdit.productname,
        shopid: productData.shopid,
        category: productData.category,
        imageurl: productToEdit.imageurl.value,
      });
      setSelectedProductId(productId);
      setDisplayImage(true);
      window.scrollTo(0, 0);
      toast.success("Product can be edited now", {
        position: "top-right",
        autoClose: 400,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const baseUrl =
        "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";
      const collectionName = "Products";
      const apiUrl = `${baseUrl}/${collectionName}/${productId}`;

      const response = await axios.delete(apiUrl);

      if (response.status === 200) {
        console.log("Product deleted successfully:", response.data);
        refreshProductList();
        setProductData({
          productname: "",
          description: "",
          stock: 0,
          price: 0,
          shopid: "shop03",
          category: "media",
          productid: "",
          imageurl: "",
        });
        setSelectedProductId(null);
        setDisplayImage(false);
        toast.success("Product Deleted", {
          position: "top-right",
          autoClose: 200,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        console.error("Error deleting product:", response.statusText);
        console.error("Response data:", response.data);
        toast.error("Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
    handleClose();
  };

  const refreshProductList = async () => {
    try {
      const baseUrl =
        "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";
      const collectionName = "Products";
      const apiUrl = `${baseUrl}/${collectionName}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const productsData = response.data.documents.map((doc) => {
          const fields = doc.fields;
          return {
            id: doc.name.split("/").pop(),
            description: fields.description.stringValue,
            stock: fields.stock.integerValue,
            price: fields.price.integerValue,
            productname: fields.productname.stringValue,
            shopid: fields.shopid.stringValue,
            category: fields.category.stringValue,
            imageurl: {
              value: fields.imageurl.stringValue,
              uploadButton: "Upload Image",
            },
          };
        });
        setProducts(productsData);
      } else {
        console.error("Error fetching products:", response.statusText);
        console.error("Response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
    <div className="bg-pink-400 text-black py-4 flex justify-between items-center">
      <h1 className="text-4xl font-bold text-center mb-8">
        Vishal Media Shop
      </h1>
      <div className="flex space-x-2">
        <Link
          to="/shop03/tablepage"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          Report Analysis
        </Link>
        <Link
          to="/shop03/admin/overall-report"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          E-Richie Analysis
        </Link>
        <Link
          to="/admin/login"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          Sign Out
        </Link>
      </div>
    </div>
    
      <div className="form-container bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedProductId ? "Update Product" : "Add a New Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          {selectedProductId && (
            <div className="mb-4">
              <label className="block text-gray-600">Product ID:</label>

              <span className="text-gray-700">{selectedProductId}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-600">Product Name:</label>

            <input
              type="text"
              name="productname"
              value={productData.productname}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Description:</label>

            <input
              type="text"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Stock:</label>
            <TextField
              type="number"
              name="stock"
              value={productData.stock}
              onInput={handleInputChange}
              required
              className="w-full py-2 text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Price:</label>

            <TextField
              type="number"
              name="price"
              value={productData.price}
              onInput={handleInputChange}
              required
              className="w-full py-2 text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Image Upload:</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
              className="w-full py-2 text-gray-700 focus:outline-none"
            />
          </div>

          {displayImage && productData.imageurl && (
            <div className="mb-4">
              <label className="block text-gray-600">Image:</label>

              <img
                src={productData.imageurl}
                alt="Product"
                className="w-32 h-32 object-contain mx-auto"
              />
            </div>
          )}

          <div className="mb-4">
            <button
              type="submit"
              className={`${
                selectedProductId ? "bg-blue-500" : "bg-green-500"
              } text-white p-2 rounded-full hover:bg-${
                selectedProductId ? "blue-600" : "green-600"
              } transition w-full`}
            >
              {selectedProductId ? "Update Product" : "Add Product"}
            </button>

            {selectedProductId && (
              <button
                type="button"
                className="bg-red-500 text-white p-2 mt-2 rounded-full hover:bg-red-600 transition w-full"
                onClick={() => handleDeleteProduct(selectedProductId)}
              >
                Delete Product
              </button>
            )}

            <button
              type="button"
              className="bg-gray-500 text-white p-2 mt-2 rounded-full hover:bg-gray-600 transition w-full"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Product List:</h2>
{/* Search bar */}
<div className="mb-4">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
        <ul className="flex flex-wrap">
        {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="flex-shrink-0 w-1/4 bg-white p-3 rounded-lg shadow-md m-2"
            >
              <div className="flex-shrink-0">
                {product.imageurl && (
                  <img
                    src={product.imageurl.value}
                    alt={product.productname}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{product.productname}</h3>

                <p className="text-gray-500">{product.description}</p>
              </div>

              <div className="ml-4 flex-shrink-0">
                <p className="font-semibold">Price: Rs.{product.price}</p>

                <p className="text-gray-500">Stock: {product.stock}</p>
              </div>

              <div className="ml-4 flex-shrink-0">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Edit
                </button>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={handleOpen}
                >
                  Delete
                </button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Confirm Delete Product?
                    </Typography>
                    <button
                      className="p-2 "
                      onClick={() => {
                        handleDeleteProduct(product.id);
                      }}
                    >
                      yes
                    </button>
                    <button className="p-2" onClick={handleClose}>
                      no
                    </button>
                  </Box>
                </Modal>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddProductForm;
