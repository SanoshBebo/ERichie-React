import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import '../styles/insertdata.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





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
        'https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products',
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

        toast.success('Data Inserted!!', {
          position: 'top-right',
          autoClose: 3000, // Time in milliseconds to keep the toast open
        });
      }
    }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };


  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  



  return (
    <section className='insertdata-container'> {/* Use the updated class name */}
    <div className="data-container"> {/* Use the updated class name */}
      <h2 className="mb-4">Insert Data into Store</h2>
      <form onSubmit={handleSubmit} className="data-form"> {/* Use the updated class name */}
        <div className="mb-3">
          <label htmlFor="productname" className="data-label"> {/* Use the updated class name */}
            Product Name:
          </label>
          <input
            type="text"
            className="data-input" 
            id="productname"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="data-label"> 
            Price:
          </label>
          <input
            type="number"
            className="data-input" 
            id="price"
            value={price}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue >= 0){
                setPrice(newValue);
              }
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="data-label">
            Description: 
          </label>
          <input
            type="text"
            className="data-input" 
            id="description"
            value={description}
            min={0}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="data-label"> 
            Stock:
          </label>
          <input
            type="number"
            className="data-input" 
            id="stock"
            value={stock}
            min={0}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue >= 0) {
                setStock(newValue);
              }
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="data-label"> 
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            className="data-input" 
            id="image"
            onChange={handleImageChange}
          />
        </div>
        <div className='abhbutton'>
        <button type="submit" className="data-button"> 
          Insert Data
        </button>
        </div>
        
      </form>
    </div>
  </section>
  );
}

export default InsertData;
