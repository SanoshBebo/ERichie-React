import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products'
      )
      .then((response) => {
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            productname: data.productname?.stringValue || '',
            description: data.description?.stringValue || '',
            price: data.price?.integerValue || 0,
            stock: data.stock?.integerValue || 0,
            imageurl: data.imageurl?.stringValue || '',
            // Include other fields as needed
          };
        });
        setProducts(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Product List</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-4">
              <strong>{product.productname}</strong> - {product.description}, Price: ${product.price}, Stock: {product.stock}
              <br />
              <br />
              
              <br />
              {product.imageurl && (
                <img src={product.imageurl} alt={product.productname} className="w-24 h-24 object-cover mb-2" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDisplay;
