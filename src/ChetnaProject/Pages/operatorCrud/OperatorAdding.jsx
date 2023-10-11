import React, { useState } from "react";
import axios from "axios";


const OperatorAdding = () => {
    const [newMobile, setNewMobile] = useState({
        category: "Mobile",
        description: "",
        price: 0,
        productname: "",
        shopid: "shop11",
        stock: 0,
        imageurl: "",
    });

    const addMobile = () => {
        const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products`;
    
        // Perform the API request using Axios
        axios
            .post(apiUrl, {
                fields: {
                    category: { stringValue: newMobile.category },
                    description: { stringValue: newMobile.description },
                    price: { integerValue: newMobile.price },
                    productname: { stringValue: newMobile.productname },
                    shopid: { stringValue: newMobile.shopid },
                    stock: { integerValue: newMobile.stock },
                    imageurl: { stringValue: newMobile.imageurl },
                },
            })
            .then((response) => {
                console.log("Mobile phone added successfully:", response.data);
                // Clear the form after successful submission
                setNewMobile({
                    category: "Mobile",
                    description: "",
                    price: 0,
                    productname: "",
                    shopid: "shop11",
                    stock: 0,
                    imageurl: "",
                });
            })
            .catch((error) => {
                console.error("Error adding mobile phone:", error);
            });
    };

    return (
        <div className="add min-h-screen flex items-center justify-center">
            <div className="bg-white border-2 border-gray-400 rounded-lg p-4 shadow-lg w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-center text-xl font-semibold mb-4">Add Product Details</h1>
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newMobile.productname}
                        onChange={(e) => setNewMobile({ ...newMobile, productname: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newMobile.description}
                        onChange={(e) => setNewMobile({ ...newMobile, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newMobile.price}
                        onChange={(e) => setNewMobile({ ...newMobile, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={newMobile.stock}
                        onChange={(e) => setNewMobile({ ...newMobile, stock: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newMobile.imageurl}
                        onChange={(e) => setNewMobile({ ...newMobile, imageurl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
                    />
                </div>
                <div className="text-center mt-4">
                    <button onClick={addMobile} className="bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-primary-color-bright">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default OperatorAdding;
