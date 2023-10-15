import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, Plus } from "lucide-react"; // Import 'Plus' icon for the "Add new Product" button
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import { fetchProducts } from "../api/ApiCalls";
import { setShopOneProducts } from "../redux/shopOneProductSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/shopOneUserSlice";

const AdminPage = () => {
  const allProducts = useSelector(
    (state) => state.shoponeproduct.shoponeproducts
  );
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refresher, setRefresher] = useState(true);
  // State variables for modals and search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState(""); // 'update' or 'delete'
  const [editedProduct, setEditedProduct] = useState({
    productname: "",
    description: "",
    stock: 0,
    price: 0,
    shopname: "CosmicMediaStore",
    category: "media",
    productid: "",
    imageurl: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // State variables for "Add Product" modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productname: "",
    description: "",
    stock: 0,
    price: 0,
    shopname: "CosmicMediaStore",
    category: "Media",
  });

  // Function to open the modal
  const openModal = (product, actionType) => {
    setIsModalOpen(true);
    setAction(actionType);
    setEditedProduct(product);
  };

  // Function to open the "Add Product" modal
  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddProductModalOpen(false); // Close the "Add Product" modal as well
  };

  // Function to handle changes in input fields for "Add Product" modal
  const handleNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchProducts()
      .then((productsData) => {
        dispatch(setShopOneProducts(productsData));
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [refresher]);

  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "sanoshadmin@gmail.com") {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

  const updateProduct = async () => {
    const payload = {
      fields: {
        productname: { stringValue: editedProduct.productname },
        description: { stringValue: editedProduct.description },
        stock: { integerValue: parseInt(editedProduct.stock, 10) },
        price: { integerValue: parseInt(editedProduct.price, 10) },
        shopid: { stringValue: "shop01" },
        category: { stringValue: "media" },
        imageurl: { stringValue: editedProduct.imageurl },
      },
    };

    try {
      const response = await axios.patch(
        `https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents/Products/${editedProduct.productid}`,
        payload
      );

      if (response.status === 200) {
        console.log("Product updated successfully:", response.data);
        setRefresher(!refresher);
        setEditedProduct({
          productname: "",
          description: "",
          stock: 0,
          price: 0,
          productid: "",
          shopname: "",
          category: "",
        });
      } else {
        console.error("Error updating product:", response.statusText);
        console.error("Response data:", response.data);
      }

      closeModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Function to delete the product
  const deleteProduct = async () => {
    try {
      const response = await axios.delete(
        `https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents/Products/${editedProduct.productid}`
      );

      if (response.status === 200) {
        console.log("Product deleted successfully:", response.data);

        // Remove the deleted product from the Redux store
        const updatedProducts = allProducts.filter(
          (product) => product.productid !== editedProduct.productid
        );
        dispatch(setProducts(updatedProducts));
      } else {
        console.error("Error deleting product:", response.statusText);
        console.error("Response data:", response.data);
      }
      if (deleteResponse.status === 200) {
        console.log("image deleted successfully:", response.data);
      } else {
        console.error("Error deleting image:", response.statusText);
        console.error("Response data:", response.data);
      }

      closeModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const addNewProduct = async () => {
    if (!selectedImage) {
      console.error("No file selected.");
      return;
    }

    const bucketName = "cosmicmediastore-438f7.appspot.com"; // Remove "gs://" prefix
    const storagePath = `images/${selectedImage.name}`;
    const apiKey = "AIzaSyDRZ26g1BQ1axqKiFn7Yf-I8JEBM0suQb8";

    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(
      storagePath
    )}`;

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await axios.post(storageUrl, formData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);

        // Once the file is uploaded, construct the image URL based on the Firebase Storage bucket and storagePath
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
          storagePath
        )}?alt=media`;

        // Now, you can proceed with adding the product to Firestore
        const payload = {
          fields: {
            productname: { stringValue: newProduct.productname },
            description: { stringValue: newProduct.description },
            stock: { integerValue: parseInt(newProduct.stock, 10) },
            price: { integerValue: parseInt(newProduct.price, 10) },
            shopid: { stringValue: "shop01" },
            category: { stringValue: "media" },
            imageurl: { stringValue: imageUrl }, // Store the image URL
          },
        };

        const firestoreResponse = await axios.post(
          "https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents/Products",
          payload
        );

        if (firestoreResponse.status === 200) {
          console.log("Product added successfully:", firestoreResponse.data);
          setRefresher(!refresher);
          setNewProduct({
            productname: "",
            description: "",
            stock: 0,
            price: 0,
          });
        } else {
          console.error("Error adding product:", firestoreResponse.statusText);
          console.error("Response data:", firestoreResponse.data);
        }

        closeModal();
      } else {
        console.error("Error uploading file:", response.statusText);
        console.error("Response data:", response.data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  // Function to handle search input changes
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products based on the search query
    const filtered = allProducts.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="header flex items-center justify-between p-4 md:p-10 px-4 md:px-20">
        <h2 className="font-bold text-2xl">Product Inventory</h2>
        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 border rounded-md w-25"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/shop01/admin/reports");
          }}
        >
          Show Shop Report
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/erichie/overall-report");
          }}
        >
          ERichie Report
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus />} // Use the 'Plus' icon for the "Add new Product" button
          onClick={openAddProductModal}
        >
          Add new Product
        </Button>
      </div>
      <div className="p-4 md:p-10 ">
        <ul className="flex-row">
          {(searchQuery ? filteredProducts : allProducts).map(
            (product, index) => (
              <li
                key={index}
                className="bg-slate-100 rounded-lg p-2 flex justify-between items-center m-3"
              >
                <div className="w-24 relative">
                  <div className="w-40 h-40">
                    <img
                      src={product.imageurl}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  {product.stock > 10 && (
                    <div className="w-44">
                      <h5 className="text-xl font-semibold">
                        Current Stock : {product.stock}
                      </h5>
                    </div>
                  )}
                  {product.stock == 0 && (
                    <div className="w-44">
                      <h5 className="text-xl font-semibold">
                        Out on Stock : {product.stock}
                      </h5>
                    </div>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="w-44">
                      <h5 className="text-xl font-semibold">
                        Low on Stock : {product.stock}
                      </h5>
                    </div>
                  )}
                </div>
                <h1 className="text-lg font-semibold">{product.productname}</h1>

                <div className="flex gap-4 p-3">
                  <Pencil
                    className="cursor-pointer"
                    onClick={() => openModal(product, "update")}
                  />
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => openModal(product, "delete")}
                  />
                </div>
              </li>
            )
          )}
        </ul>
      </div>
      {/* Modals */}
      {/* Update Modal */}
      <Modal
        open={isModalOpen && action === "update"}
        onClose={closeModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "darkgray",
            color: "#000",
            width: 400,
            p: 4,
            borderRadius: 4,
            textAlign: "left",
          }}
        >
          <Typography variant="h5" component="div" className="text-white">
            Edit Product
          </Typography>
          <p className="text-white">productname</p>
          <input
            type="text"
            name="productname"
            value={editedProduct.productname}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />
          <p className="text-white">description</p>
          <input
            type="text"
            name="description"
            value={editedProduct.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />

          <p className="text-white">stock</p>
          <input
            type="number"
            name="stock"
            value={editedProduct.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />
          <p className="text-white">price</p>
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />

          {/* Add input fields for other product details */}
          <Button
            variant="contained"
            color="primary"
            onClick={updateProduct}
            className="mt-3"
          >
            Update
          </Button>
        </Box>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        open={isModalOpen && action === "delete"}
        onClose={closeModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#000",
            color: "#000",
            width: 400,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component="div" className="text-white">
            Delete Product
          </Typography>
          <p className="text-white my-2">
            Are you sure you want to delete this product?
          </p>
          <div className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={deleteProduct}
              className="m-2"
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={closeModal}
              className="m-2"
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
      {/* Add Product Modal */}
      <Modal
        open={isAddProductModalOpen}
        onClose={closeModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#000",
            color: "#000",
            width: 400,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component="div" className="text-white">
            Add Product
          </Typography>
          <input
            type="text"
            name="productname"
            value={newProduct.productname}
            onChange={handleNewProductInputChange}
            placeholder="Product Name"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleNewProductInputChange}
            placeholder="Product Description"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />

          <input
            type="number"
            name="stock"
            onChange={handleNewProductInputChange}
            placeholder="Stock"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />

          <input
            type="number"
            name="price"
            onChange={handleNewProductInputChange}
            placeholder="Price"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />
          <input
            disabled
            type="text"
            name="shopname"
            value={newProduct.shopname}
            onChange={handleInputChange}
            placeholder="shopname"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />
          <input
            disabled
            type="text"
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            placeholder="category"
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            className="my-2 p-2 w-full"
            style={{ outline: "none" }}
          />

          {/* Add input fields for other product details */}
          <Button
            variant="contained"
            color="primary"
            onClick={addNewProduct}
            className="mt-3"
          >
            Add Product
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminPage;
