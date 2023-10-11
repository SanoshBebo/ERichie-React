import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CSS/AddProduct.css"

const ProductForm = () => {
    const [product, setProduct] = useState({
        productname: '',
        description: '',
        price: '',
        stock: '',

    });

    const [imageFile, setImageFile,setImageUrl] = useState(''); // Store the image file

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]); // Store the selected image file
    };

    const uploadImageToFirebaseStorage = async (file) => {
        try {
            const apiKey = "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ"; // Replace with your Firebase API key
            const bucketName = "adminstore-196a7.appspot.com"; // Use your Firebase Storage bucket name
            const storagePath = `Products/${file.name}`;

            // Generate a Firebase Storage URL
            const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(storagePath)}`;

            // Upload the image file to Firebase Storage using a POST request
            const uploadResponse = await axios.post(storageUrl, file, {
                headers: {
                    'Content-Type': file.type,
                    Authorization: `Bearer ${apiKey}`,
                },
            });

            if (uploadResponse.status === 200) {
                // Image upload was successful, now get the download URL
                const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media`;

                return downloadUrl;
            } else {
                console.error('Error uploading image:', uploadResponse.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload the image to Firebase Storage
            const imageurl = await uploadImageToFirebaseStorage(imageFile);

            if (imageurl) {
                const apiKey = "AIzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ"; // Replace with your Firebase API key

                // Create a Firestore document with the image URL and other fields
                const firestoreResponse = await axios.post(
                    `https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products?key=IzaSyCYi91lSnCgGpmOm-5fBjayL_npM65bZcQ`,
                    {
                        fields: {
                            productname: { stringValue: product.name },
                            description: { stringValue: product.description },
                            price: { integerValue: parseInt(product.price) },
                            stock: { integerValue: parseInt(product.stock) },
                            shopid: { stringValue: "shop15" },
                            category: { stringValue: "computer" },
                            imageurl: { stringValue: imageurl }, // Store the image URL
                        },
                    }
                );
                clearForm();
                toast.success('Your product has been successfully added!'); // Use toast.success to display a success notification
                
                // console.log('Product added:', firestoreResponse.data);
            

            } else {
                console.error('Error uploading image or retrieving image URL.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }finally {
            setImageFile(null); // Clear the image field regardless of success or failure
        }
    };

    const clearForm = () => {
        setProduct({
            productname: '',
            description: '',
            price: '',
            stock: '',
        });
        setImageFile(null);
    };
    

    return (
        <section className='addproducts'>
        <div className="add">
            <h2>Add a New Product</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="productname"
                        value={product.productname}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <br></br>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Stock:
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Image File:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <br />
                <button type="submit">Add Product</button>
            </form>
        </div>
       
        </section>
    );
};

export default ProductForm;
