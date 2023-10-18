import React, { useState, useEffect } from "react";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function ProductList() {
  const [products, setProducts] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [editProductId, setEditProductId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [imageFile, setImageFile] = useState(null);

  const [product, setProduct] = useState({
    productname: "",

    description: "",

    price: 0,

    stock: 0,

    category: "Gaming",

    shopid: "shop07",
  });

  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products"; // Replace with your Firestore database URL

  const bucketName = "myapp-5dc30"; // Replace with your Firebase Storage bucket name

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

  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product.id === id);

    if (productToEdit) {
      setIsEditing(true);

      setEditProductId(id);

      setProduct({
        productname: productToEdit.fields.productname.stringValue,

        description: productToEdit.fields.description.stringValue,

        price: productToEdit.fields.price.integerValue,

        stock: productToEdit.fields.stock.integerValue,

        category: productToEdit.fields.category.stringValue,

        shopid: productToEdit.fields.shopid.stringValue,
      });

      setShowModal(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);

      toast.success("Product deleted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      const updatedProducts = products.filter((product) => product.id !== id);

      setProducts(updatedProducts);

      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error: Product deletion failed");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setEditProductId(null);

    setShowModal(false);

    setProduct({
      productname: "",

      description: "",

      price: 0,

      stock: 0,

      category: "Gaming",

      shopid: "shop07",
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToFirebaseStorage = async () => {
    try {
      const apiKey = "YOUR_API_KEY"; // Replace with your Firebase API Key

      const storagePath = `Products/${imageFile.name}`;

      const formData = new FormData();

      formData.append("file", imageFile);

      const uploadResponse = await axios.post(
        `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(
          storagePath
        )}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${apiKey}`,

            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/myapp-5dc30.appspot.com/o/images%2FScreenshot%20(8).png?alt=media`;

        return downloadUrl;
      } else {
        console.error("Error uploading image:", uploadResponse.statusText);

        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      return null;
    }
  };

  const handleSaveProduct = async (imageurl) => {
    const newProduct = {
      productname: product.productname,

      description: product.description,

      price: product.price,

      stock: product.stock,

      category: product.category,

      shopid: product.shopid,

      imageurl: imageurl,
    };

    // Make a POST request to add the product to the database

    try {
      const response = await axios.post(apiUrl, {
        fields: {
          productname: { stringValue: newProduct.productname },

          description: { stringValue: newProduct.description },

          price: { integerValue: newProduct.price },

          stock: { integerValue: newProduct.stock },

          category: { stringValue: newProduct.category },

          shopid: { stringValue: newProduct.shopid },

          imageurl:
            "https://firebasestorage.googleapis.com/v0/b/myapp-5dc30.appspot.com/o/images%2FScreenshot%20(8).png?alt=media",
        },
      });

      if (response.status === 200) {
        toast.success("Product added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        const newProductData = {
          id: response.data.name.split("/").pop(),

          fields: response.data.fields,
        };

        setProducts((prevProducts) => [...prevProducts, newProductData]);

        setShowModal(false);
      } else {
        console.error("Error: Product addition failed");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleAddProduct = async () => {
    const imageUrl = await uploadImageToFirebaseStorage();

    if (imageUrl) {
      handleSaveProduct(imageUrl);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product List</h1>

        <div className="space-x-4">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Search
          </button>

          <button
            onClick={() => {
              setIsEditing(false);

              setEditProductId(null);

              setShowModal(true);
            }}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add Product
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">Product Name</th>

            <th className="p-2 border border-gray-300">Description</th>

            <th className="p-2 border border-gray-300">Price</th>

            <th className="p-2 border border-gray-300">Stock</th>

            <th className="p-2 border border-gray-300">Image</th>

            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100">
              <td className="p-2 border border-gray-300">
                {product.fields.productname.stringValue}
              </td>

              <td className="p-2 border border-gray-300">
                {product.fields.description.stringValue}
              </td>

              <td className="p-2 border border-gray-300">
                Rs. {product.fields.price.integerValue}
              </td>

              <td className="p-2 border border-gray-300">
                {product.fields.stock.integerValue}
              </td>

              <td className="p-2 border border-gray-300">
                <img
                  src={product.fields.imageurl.stringValue}
                  alt={product.fields.productname.stringValue}
                  className="h-12"
                />
              </td>

              <td className="p-2 border border-gray-300">
                <button
                  onClick={() => handleEditProduct(product.id)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position={toast.POSITION.TOP_RIGHT} />

      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            onClick={handleCancelEdit}
          ></button>

          <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>

            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
              onClick={handleCancelEdit}
            >
              Close
            </button>

            <div className="container mx-auto p-4">
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  {isEditing ? "Edit Product" : "Add a New Product"}
                </h2>

                <form>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold">
                        Product Name:
                      </label>

                      <input
                        type="text"
                        name="productname"
                        value={product.productname}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            productname: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold">
                        Description:
                      </label>

                      <textarea
                        name="description"
                        value={product.description}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            description: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold">
                        Price:
                      </label>

                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) =>
                          setProduct({ ...product, price: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold">
                        Stock:
                      </label>

                      <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={(e) =>
                          setProduct({ ...product, stock: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold">
                        Category:
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={(e) =>
                          setProduct({ ...product, category: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold">
                        Shop ID:
                      </label>

                      <input
                        type="text"
                        name="shopid"
                        value={product.shopid}
                        onChange={(e) =>
                          setProduct({ ...product, shopid: e.target.value })
                        }
                        readOnly
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold">
                        Image File:
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    {imageFile && (
                      <div className="mt-4">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Product Preview"
                          className="max-w-xs mx-auto"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={isEditing ? handleEditProduct : handleAddProduct}
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                  >
                    {isEditing ? "Save Changes" : "Add Product"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
