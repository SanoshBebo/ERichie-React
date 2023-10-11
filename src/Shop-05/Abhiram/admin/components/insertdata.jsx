import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import '../styles/insertdata.css';
import { useAuthState } from 'react-firebase-hooks/auth';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS





 function InsertData() {

  const [productname, setProductname] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageurl, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [shopid, setShopid] =useState('');
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (image) {
        const imageName = `${Date.now()}_${image.name}`;
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/images%2F${encodeURIComponent(imageName)}?name=${encodeURIComponent(imageName)}`;
        
        const formData = new FormData();
        formData.append('file', image);

        await Axios.post(storageUrl, formData, {
          headers: {
            'Content-Type': image.type,
          },
        });

        // Once the image is uploaded, get the download URL
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/abhiram-store.appspot.com/o/images%2F${encodeURIComponent(imageName)}?alt=media`;
        // console.log(downloadUrl);
      
        
      const response = await Axios.post(
        'https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products',
        {
          fields: {
            productname: { stringValue: productname },
            price: { integerValue: parseInt(price) },
            imageurl: { stringValue: downloadUrl },
            category: { stringValue: "computer" },
            description: { stringValue: description },
            stock: { integerValue: parseInt(stock) },
            shopid: {stringValue: "shop13"},
          },
          
        },

      );

      if (response.status === 200) {
        console.log('Data inserted successfully');
        // Clear the form fields
        setProductname('');
        setPrice('');
        setDescription('');
        setStock('');
        setUrl('');
      }
    }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };




  return (
    <section className='insertdata'>
    <div className="container mt-5">
      <h2 className="mb-4">Insert Data into Firestore</h2>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-3">
          <label htmlFor="modelno" className="form-label">
            Model No:
          </label>
          <input
            type="text"
            className="form-control"
            id="modelno"
            placeholder='Start with B-motherboard/D-Desktop/.... eg: D001'
            value={modelno}
            onChange={(e) => setModelno(e.target.value)}
          />
        </div> */}
        <div className="mb-3">
          <label htmlFor="productname" className="form-label">
            Product Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="productname"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock:
          </label>
          <input
            type="number"
            className="form-control"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="image"
            onChange={handleImageChange}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          Insert Data
        </button>
      </form>
    </div>
    </section>
  );
}

export default InsertData;
