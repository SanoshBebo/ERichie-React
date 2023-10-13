import React, { useState, useEffect } from "react";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import TablePage from "./TablePage"; // Use relative import

 

const AddProductForm = () => {

  const navigate = useNavigate();

  const [productData, setProductData] = useState({

    productname: "",

    description: "",

    stock: 0,

    price: 0,

    shopid: "shop03", // Fixed shop name

    category: "media", // Fixed category

    productid: "",

    imageurl: "",

  });

 

  const [products, setProducts] = useState([]); // Store the list of products

  const [selectedProductId, setSelectedProductId] = useState(null);

  const [displayImage, setDisplayImage] = useState(true); // Control image display

 

  useEffect(() => {

    // Fetch the list of products from your API and populate the products state

    async function fetchProducts() {

      try {

        const baseUrl =

          "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

        const collectionName = "Products";

        const apiUrl = `${baseUrl}/${collectionName}`;

        const response = await axios.get(apiUrl);

 

        if (response.status === 200) {

          // Extract the product data from the response and set it in the products state

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

                uploadButton: "Upload Image", // You can customize the button text

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

    }

 

    fetchProducts();

  }, []); // Fetch products once when the component mounts

 

  const handleInputChange = (event) => {

    const { name, value } = event.target;

    setProductData({

      ...productData,

      [name]: value,

    });

  };

 

  const handleImageUpload = (event) => {

    const file = event.target.files[0];

    if (file) {

      // Upload the image to Firebase Storage

      const storageBucket = "about-me-bf7ef.appspot.com"; // Replace with your Firebase Storage bucket name

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

              imageurl: storageUrl, // Store the image URL

            });

            setDisplayImage(true); // Display the uploaded image

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

 

    // Check if any required field is missing

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

      // Define your base URL

      const baseUrl =

        "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

 

      // Define the collection you want to add/update the product in (e.g., 'Products')

      const collectionName = "Products";

 

      // Create the full API URL for the new document or the specific product document to be updated

      const apiUrl = selectedProductId

        ? `${baseUrl}/${collectionName}/${selectedProductId}`

        : `${baseUrl}/${collectionName}`;

 

      // Check if a new image has been uploaded

      const hasNewImage =

        productData.imageurl !==

        products.find((p) => p.id === selectedProductId)?.imageurl.value;

      // Create a payload object with the product data

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

 

      // Use Axios to make a POST (for adding) or PATCH (for updating) request

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

        // Clear the form after successful submission

        setProductData({

          productname: "",

          description: "",

          stock: 0,

          price: 0,

          shopid: "shop03", // Reset shop name

          category: "media", // Reset category

          productid: "",

          imageurl: "",

        });

 

        setSelectedProductId(null); // Clear the selected product ID after adding/updating

        refreshProductList(); // Refresh the product list after adding/updating

        setDisplayImage(false); // Hide the displayed image

      } else {

        console.error(

          selectedProductId

            ? "Error updating product:"

            : "Error adding new product:",

          response.statusText

        );

        console.error("Response data:", response.data);

      }

    } catch (error) {

      console.error(

        selectedProductId

          ? "Error updating product:"

          : "Error adding new product:",

        error

      );

    }

  };

 

  const handleEditProduct = (productId) => {

    // Find the product with the given ID in the products list

    const productToEdit = products.find((product) => product.id === productId);

    if (productToEdit) {

      // Set the product data in the form for editing

      setProductData({

        description: productToEdit.description,

        stock: productToEdit.stock,

        price: productToEdit.price,

        productname: productToEdit.productname,

        shopid: productData.shopid, // Restore fixed shop name

        category: productData.category, // Restore fixed category

        imageurl: productToEdit.imageurl.value, // Restore image URL

      });

      setSelectedProductId(productId);

      setDisplayImage(true); // Display the image when editing

      window.scrollTo(0, 0);

    }

  };

 

  const handleDeleteProduct = async (productId) => {

    const shouldDelete = window.confirm(

      "Are you sure you want to delete this product?"

    );

 

    if (shouldDelete) {

      try {

        // Define your base URL

        const baseUrl =

          "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

 

        // Define the collection where the product is stored (e.g., 'Products')

        const collectionName = "Products";

 

        // Create the full API URL for the specific product document to be deleted

        const apiUrl = `${baseUrl}/${collectionName}/${productId}`;

 

        // Use Axios to make a DELETE request to delete the product document

        const response = await axios.delete(apiUrl);

 

        if (response.status === 200) {

          console.log("Product deleted successfully:", response.data);

          // Refresh the product list after deleting

          refreshProductList();

          // Clear the form

          setProductData({

            productname: "",

            description: "",

            stock: 0,

            price: 0,

            shopid: "shop03", // Reset shop name

            category: "media", // Reset category

            productid: "",

            imageurl: "",

          });

          setSelectedProductId(null); // Clear the selected product ID

          setDisplayImage(false); // Hide the displayed image

        } else {

          console.error("Error deleting product:", response.statusText);

          console.error("Response data:", response.data);

        }

      } catch (error) {

        console.error("Error deleting product:", error);

      }

    }

  };

 

  const refreshProductList = async () => {

    // Fetch the updated list of products from your API and update the products state

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

              uploadButton: "Upload Image", // You can customize the button text

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

    // Use the navigate function to go back to the previous page

    navigate(-1); // -1 takes you back one step in the navigation history

  };

 

  return (

    <div className="p-4 bg-gray-100 rounded-lg">

      <div className="header bg-pink-400 text-black py-4 flex justify-between items-center">

        <h1 className="text-4xl font-bold text-center mb-8">

          Vishal Media Shop

        </h1>

        <Link

          to="/shop03/tablepage"

          className="bg-blue-500 text-white p-2 ml-2 rounded-full hover:bg-blue-600 transition"

        >

          Report Analysis

        </Link>

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

            <input

              type="number"

              name="stock"

              value={productData.stock}

              onChange={handleInputChange}

              required

              className="w-full border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"

            />

          </div>

          <div className="mb-4">

            <label className="block text-gray-600">Price:</label>

            <input

              type="number"

              name="price"

              value={productData.price}

              onChange={handleInputChange}

              required

              className="w-full border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"

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

        <ul className="flex flex-wrap">

          {products.map((product) => (

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

                  onClick={() => handleDeleteProduct(product.id)}

                >

                  Delete

                </button>

              </div>

            </li>

          ))}

        </ul>

      </div>

    </div>

  );

};

 

export default AddProductForm;