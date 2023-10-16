import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [editMode, setEditMode] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    id: "",
    productname: "",
    description: "",
    imageurl: "",
    stock: 0,
    price: "",
    type: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          const productData = response.data.documents.map((doc) => ({
            id: doc.name.split("/").pop(),
            productname: doc.fields.productname
              ? doc.fields.productname.stringValue
              : "",
            description: doc.fields.description
              ? doc.fields.description.stringValue
              : "",
            imageurl: doc.fields.imageurl
              ? doc.fields.imageurl.stringValue
              : "",
            stock: doc.fields.stock ? doc.fields.stock.integerValue : 0,
            price: doc.fields.price ? doc.fields.price.integerValue : "",
            type: doc.fields.type ? doc.fields.type.stringValue : "",
          }));

          setProducts(productData);
          console.log("Products fetched successfully:", productData);
        } else {
          console.error("Error fetching products. Response:", response);
          toast.error('Error fetching products:contact concerned person', { position: toast.POSITION.TOP_RIGHT  });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error('Error fetching products:contact concerned person', { position: toast.POSITION.TOP_RIGHT  });
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      typeof product.productname === "string" &&
      product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (product) => {
    setEditMode(product.id);
    setEditedProduct({
      id: product.id,
      productname: product.productname,
      description: product.description,
      imageurl: product.imageurl,
      stock: product.stock,
      price: product.price,
      type: product.type,
    });
    setSelectedImage(product.imageurl);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${encodeURIComponent(file.name)}`;
        const firebaseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/lemontech-67162.appspot.com/o/${filename}?alt=media`;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(firebaseStorageUrl, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setSelectedImage(firebaseStorageUrl);
          setEditedProduct({ ...editedProduct, imageurl: firebaseStorageUrl });
        } else {
          console.error("Error uploading image:", response.statusText);
          toast.error('Error uploading image ', { position: toast.POSITION.TOP_RIGHT  });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image", { position: toast.POSITION.TOP_RIGHT  });
      }
    }
  };

  const handleSaveClick = async () => {
    // Validate that editedProduct.stock is not negative
  if (editedProduct.stock < 0) {
    toast.error('Stock cannot be negative ', { position: toast.POSITION.TOP_RIGHT  });
    return;
  }
  if (editedProduct.price < 0) {
    toast.error('Price cannot be negative ', { position: toast.POSITION.TOP_RIGHT  });
    return;
  }
    const updatedProductData = {
      fields: {
        productname: { stringValue: editedProduct.productname },
        description: { stringValue: editedProduct.description },
        imageurl: { stringValue: editedProduct.imageurl },
        stock: { integerValue: editedProduct.stock },
        price: { integerValue: editedProduct.price },
        type: { stringValue: editedProduct.type },
        shopid: { stringValue: "shop10" },
        category: { stringValue: "mobile" },
      },
      
    };

    try {
      const response = await axios.patch(
        `${apiUrl}/${editedProduct.id}`,
        updatedProductData
      );

      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product.id === editedProduct.id
            ? { ...product, ...editedProduct }
            : product
        );
        setProducts(updatedProducts);
        console.log("Product updated successfully:", editedProduct);
        toast.success('Product updated successfully ', { position: toast.POSITION.TOP_RIGHT  });

        setEditMode(null);
        setEditedProduct({
          id: "",
          productname: "",
          description: "",
          imageurl: "",
          stock: 0,
          price: "",
          type: "",
        });
      } else {
        console.error("Error updating product. Response:", response);
        toast.error('Product  not updated  ', { position: toast.POSITION.TOP_RIGHT  });
        
      }
    } catch (error) {
      console.error("Error updating product:", error);
      console.error("Response data:", error.response.data);
    }
  };

  const handleDeleteClick = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/${productId}`);

        if (response.status === 200) {
          const updatedProducts = products.filter(
            (product) => product.id !== productId
          );
          setProducts(updatedProducts);
          console.log("Product deleted successfully:", productId);
          toast.success('Product deleted successfully ', { position: toast.POSITION.TOP_RIGHT  });
        } else {
          console.error("Error deleting product. Response:", response);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error('Product deleted successfully ', { position: toast.POSITION.TOP_RIGHT  });
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setEditedProduct({
      id: "",
      productname: "",
      description: "",
      imageurl: "",
      stock: 0,
      price: "",
      type: "",
    });
  };

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <h1 className="text-2xl font-semibold">Product List</h1>
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mt-2 w-full border rounded focus:outline-none focus:border-blue-500"
        style={{ width: 'auto' }}
      />
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">Product Name</th>
            <th className="py-2 px-4 bg-gray-200">Description</th>
            <th className="py-2 px-4 bg-gray-200">Image</th>
            <th className="py-2 px-4 bg-gray-200">Stock</th>
            <th className="py-2 px-4 bg-gray-200">Price</th>
            <th className="py-2 px-4 bg-gray-200">Type</th>
            <th className="py-2 px-4 bg-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <input
                    type="text"
                    value={editedProduct.productname}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        productname: e.target.value,
                      })
                    }
                    className="p-1 w-full border rounded focus:outline-none focus:border-blue-500"
                    style={{ width: 'auto' }}
                  />
                ) : (
                  product.productname
                )}
              </td>
              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <input
                    type="text"
                    value={editedProduct.description}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        description: e.target.value,
                      })
                    }
                    className="p-1 w-full border rounded focus:outline-none focus:border-blue-500"
                    style={{ width: 'auto' }}
                  />
                ) : (
                  product.description
                )}
              </td>
              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Product"
                        style={{ maxWidth: "100px" }}
                        className="mt-2"
                      />
                    )}
                  </div>
                ) : (
                  <img
                    src={product.imageurl}
                    alt="Product"
                    style={{ maxWidth: "100px" }}
                    className="mt-2"
                  />
                )}
              </td>
              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <input
                    type="number"
                    value={editedProduct.stock}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        stock: e.target.value,
                      })
                    }
                    className="p-1 w-full border rounded focus:outline-none focus:border-blue-500"
                    style={{ width: 'auto' }}
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <input
                    type="number"
                    value={editedProduct.price}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        price: e.target.value,
                      })
                    }
                    className="p-1 w-full border rounded focus:outline-none focus:border-blue-500"
                    style={{ width: 'auto' }}
                  />
                ) : (
                  product.price
                )}
              </td>
              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <input
                    type="text"
                    value={editedProduct.type}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (typeof inputValue === "string") {
                        // Only update the editedProduct if the input is a string
                        setEditedProduct({
                          ...editedProduct,
                          type: inputValue,
                        });
                      }
                    }}
                    className="p-1 w-full border rounded focus:outline-none focus:border-blue-500"
                    style={{ width: 'auto' }}
                  />
                ) : (
                  product.type
                  
                )}
              </td>

              <td className="py-2 px-4">
                {editMode === product.id ? (
                  <div>
                    <button style={{ fontWeight: 'bold' }}
                      className="admin_crud_button mr-2"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                    <button style={{ fontWeight: 'bold' }}
                      className="admin_cancel_button"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button style={{ fontWeight: 'bold' }}
                      className="admin_crud_button mr-2"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button style={{ fontWeight: 'bold' }}
                      className="admin_delete_button"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= filteredProducts.length}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;
