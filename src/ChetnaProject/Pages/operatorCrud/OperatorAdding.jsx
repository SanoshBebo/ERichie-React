

import React, { useState, useRef } from "react";

import axios from "axios";

import Modal from "react-modal";

 

const OperatorAdding = () => {

    const [newMobile, setNewMobile] = useState({

        category: "Mobile",

        description: "",

        price: "",

        productname: "",

        shopid: "shop11",

        stock: "",

        imageurl: "",

    });

    const [imagePreview, setImagePreview] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const fileInputRef = useRef(null);

 

    const handleImageUpload = async (e) => {

        const file = e.target.files[0];

        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/e-mobile-81b40.appspot.com/o/${encodeURIComponent(

            "images/" + file.name

        )}`;

        try {

            const response = await axios.post(storageUrl, file, {

                headers: {

                    "Content-Type": file.type,

                },

            });

            if (response.status === 200) {

                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/e-mobile-81b40.appspot.com/o/${encodeURIComponent(

                    "images/" + file.name

                )}?alt=media`;

                setNewMobile({ ...newMobile, imageurl: imageUrl });

 

                const reader = new FileReader();

                reader.onloadend = () => {

                    setImagePreview(reader.result);

                };

                reader.readAsDataURL(file);

            }

        } catch (error) {

            console.error("Error uploading image:", error);

        } finally {

 

            setImagePreview(null);

        }

        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };

 

    const addMobile = () => {

        if (

            !newMobile.productname ||

            !newMobile.description ||

            !newMobile.price ||

            !newMobile.stock ||

            !newMobile.imageurl

        ) {

            alert("All fields are mandatory.");

            return;

        }

 

        const apiUrl = `https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products`;

        axios

            .post(apiUrl, {

                fields: {

                    category: { stringValue: newMobile.category },

                    description: { stringValue: newMobile.description },

                    price: { integerValue: parseInt(newMobile.price, 10) },

                    productname: { stringValue: newMobile.productname },

                    shopid: { stringValue: newMobile.shopid },

                    stock: { integerValue: parseInt(newMobile.stock, 10) },

                    imageurl: { stringValue: newMobile.imageurl },

                },

            })

            .then((response) => {

                console.log("Mobile phone added successfully:", response.data);

                setNewMobile({

                    category: "Mobile",

                    description: "",

                    price: "",

                    productname: "",

                    shopid: "shop11",

                    stock: "",

                    imageurl: "",

                });

                setImagePreview(null);

                setSuccessMessage("Product added successfully");

                setIsModalOpen(true);

                setTimeout(() => {

                    setIsModalOpen(false);

                    setSuccessMessage("");

                }, 3000);

            })

            .catch((error) => {

                console.error("Error adding mobile phone:", error);

            });

        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };

 

    const inputStyle = {

        width: "100%",

        padding: "10px",

        margin: "10px 0",

        borderRadius: "5px",

        border: "1px solid #ccc",

        fontSize: "16px",

        outline: "none",

    };

 

    const imagePreviewStyle = {

        width: "100px",

        height: "100px",

        objectFit: "cover",

        borderRadius: "5px",

        margin: "10px 0",

    };

 

    return (

        <div className="add-container" style={{ textAlign: "center", marginTop: "20px" }}>

            <div className="heading">

                <h1 style={{ color: "red", fontSize: "24px", textAlign: "center" }}>Add Product Details</h1>

                <div className="inputfield-container" style={{ maxWidth: "300px", margin: "0 auto" }}>

                    <input

                        type="text"

                        placeholder="Product Name"

                        value={newMobile.productname}

                        onChange={(e) => setNewMobile({ ...newMobile, productname: e.target.value })}

                        style={inputStyle}

                    />

                    <input

                        type="text"

                        placeholder="Description"

                        value={newMobile.description}

                        onChange={(e) => setNewMobile({ ...newMobile, description: e.target.value })}

                        style={inputStyle}

                    />

                    <input

                        type="number"

                        placeholder="Price"

                        min="1"

                        value={newMobile.price}

                        onChange={(e) => setNewMobile({ ...newMobile, price: e.target.value })}

                        style={inputStyle}

                    />

                    <input

                        type="number"

                        placeholder="Stock"

                        min="1"

                        value={newMobile.stock}

                        onChange={(e) => setNewMobile({ ...newMobile, stock: e.target.value })}

                        style={inputStyle}

                    />

                    <input

                        type="file"

                        accept="image/*"

                        onChange={handleImageUpload}

                        style={inputStyle}

                        ref={fileInputRef}

                    />

                    {imagePreview && <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />}

                </div>

                <div className="addbtn" style={{ marginTop: "20px" }}>

                    <button

                        onClick={addMobile}

                        style={{

                            backgroundColor: "#007bff",

                            color: "white",

                            padding: "10px 20px",

                            border: "none",

                            borderRadius: "5px",

                            fontSize: "16px",

                            cursor: "pointer",

                        }}

                    >

                        Submit

                    </button>

                </div>

            </div>

            <Modal

                isOpen={isModalOpen}

                onRequestClose={() => setIsModalOpen(false)}

                contentLabel="Product Added Modal"

                className="modal-content"

                style={{

                    content: {

                        width: "200px",

                        margin: "0 auto",

                        borderRadius: "5px",

                        padding: "20px",

                    },

                }}

            >

                <h2 style={{ textAlign: "center", marginBottom: "10px", color: "white", border: "2px solid green", background: "green" }}>{successMessage}</h2>

                <button

                    onClick={() => setIsModalOpen(false)}

                    style={{

                        backgroundColor: "#007bff",

                        color: "white",

                        padding: "10px 20px",

                        border: "none",

                        borderRadius: "5px",

                        fontSize: "16px",

                        cursor: "pointer",

                        marginTop: "10px",

                    }}

                >

                    Close

                </button>

            </Modal>

        </div>

    );

};

 

export default OperatorAdding;

 