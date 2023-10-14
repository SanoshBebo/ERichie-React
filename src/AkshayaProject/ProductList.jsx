import React, { useState, useEffect } from "react";

import axios from "axios";

const ProductList = () => {
  const firestoreApiKey = "AIzaSyAMTkJfx4_ZowkhsFySraPbqI-ZoGOEt6U";

  const firestoreProjectId = "e-ritchie";

  const firestoreCollection = "Products";

  const [products, setProducts] = useState([]);

  const [deleteProductName, setDeleteProductName] = useState("");

  const [updateProductDetails, setUpdateProductDetails] = useState({
    id: "",

    name: "",

    description: "",

    price: "",

    stock: "",

    category: "",

    shopname: "",

    imageurl: "",
  });

  const [updateImageFile, setUpdateImageFile] = useState(null);

  useEffect(() => {
    // Fetch products from Firestore

    axios

      .get(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}?key=${firestoreApiKey}`
      )

      .then((response) => {
        const fetchedProducts = response.data.documents.map((doc) => {
          const product = doc.fields;

          return {
            id: doc.name.split("/").pop(),

            name: product.productname ? product.productname.stringValue : "",

            description: product.description
              ? product.description.stringValue
              : "",

            price: product.price ? product.price.integerValue : 0,

            stock: product.stock ? product.stock.integerValue : 0,

            category: product.category ? product.category.stringValue : "",

            shopname: product.shopname ? product.shopname.stringValue : "",

            imageurl: product.imageurl ? product.imageurl.stringValue : "",
          };
        });

        console.log(fetchedProducts);

        setProducts(fetchedProducts);
      })

      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, [firestoreApiKey, firestoreProjectId]);

  const handleUpdateProduct = async (event) => {
    event.preventDefault();

    try {
      let imageurl = updateProductDetails.imageurl; // Use the existing imageUrl by default

      // Check if a new image file is selected

      if (updateImageFile) {
        imageurl = await uploadImageToFirebaseStorage(updateImageFile);
      }

      const updatedProductData = {
        productname: { stringValue: updateProductDetails.name },

        description: { stringValue: updateProductDetails.description },

        price: { integerValue: parseFloat(updateProductDetails.price) },

        stock: { integerValue: parseInt(updateProductDetails.stock) },

        category: { stringValue: updateProductDetails.category },

        imageurl: { stringValue: imageurl },
      };

      // Update product in Firebase

      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}/${updateProductDetails.id}?key=${firestoreApiKey}`,

        { fields: updatedProductData }
      );

      // Update the product in the products state

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updateProductDetails.id
            ? { ...product, ...updateProductDetails, imageurl }
            : product
        )
      );

      console.log("Product updated successfully:", updateProductDetails.name);

      setUpdateProductDetails({
        id: "",

        name: "",

        description: "",

        price: "",

        stock: "",

        category: "",

        shopname: "",

        imageurl: "",
      });

      setUpdateImageFile(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];

    setUpdateImageFile(file);
  };

  const uploadImageToFirebaseStorage = async (file) => {
    try {
      const apiKey = firestoreApiKey;

      const bucketName = "e-ritchie.appspot.com"; // Replace with your actual Firebase Storage bucket name

      const storagePath = `Products/${file.name}`;

      const formData = new FormData();

      formData.append("file", file);

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
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
          storagePath
        )}?alt=media`;

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

  const handleDeleteProduct = (productName) => {
    // Find product by name and get its ID

    const productToDelete = products.find(
      (product) => product.name === productName
    );

    if (!productToDelete) {
      console.error("Product not found for deletion");

      return;
    }

    // Delete product from Firebase

    axios

      .delete(
        `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${firestoreCollection}/${productToDelete.id}`
      )

      .then(() => {
        // Remove the deleted product from the products state

        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.name !== productName)
        );

        console.log("Product deleted successfully:", productName);
      })

      .catch((error) => {
        console.error("Error deleting product", error);
      });
  };

  const handleUpdateClick = (product) => {
    setUpdateProductDetails(product);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUpdateProductDetails((prevDetails) => ({
      ...prevDetails,

      [name]: value,
    }));
  };

  return (
    <div className="p-5">
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border p-4 mb-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <strong>{product.name}</strong> - {product.description}, $
                {product.price}, Stock: {product.stock}, Category:{" "}
                {product.category}, Shop: {product.shopname}
                <button
                  className="ml-2 p-2 bg-blue-500 text-white"
                  onClick={() => handleDeleteProduct(product.name)}
                >
                  Delete
                </button>
                <button
                  className="ml-2 p-2 bg-blue-500 text-white"
                  onClick={() => handleUpdateClick(product)}
                >
                  Update
                </button>
              </div>

              {product.imageurl && (
                <div className="my-2">
                  <img
                    src={product.imageurl}
                    alt={product.name}
                    className="max-w-24 max-h-24"
                  />
                </div>
              )}

              {updateProductDetails.id === product.id && (
                <form className="update-form" onSubmit={handleUpdateProduct}>
                  <div className="mb-3">
                    <label htmlFor="name" className="block mb-1">
                      Name:
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={updateProductDetails.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="block mb-1">
                      Description:
                    </label>

                    <textarea
                      name="description"
                      value={updateProductDetails.description}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="price" className="block mb-1">
                      Price:
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={updateProductDetails.price}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="stock" className="block mb-1">
                      Stock:
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={updateProductDetails.stock}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="block mb-1">
                      Category:
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={updateProductDetails.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newImage" className="block mb-1">
                      New Image:
                    </label>

                    <input
                      type="file"
                      name="newImage"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="border p-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Update
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
