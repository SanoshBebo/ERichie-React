// // src/components/ProductList.js
// import React, { useEffect, useState } from 'react';

// function ProductList() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const apiUrl = "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products";

//     fetch(apiUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         // Extract the documents from the Firestore response
//         const firestoreDocuments = data.documents || [];

//         // Extract relevant data from each document
//         const productList = firestoreDocuments.map((doc) => doc.fields);

//         setProducts(productList);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   return (
//     <div className="product-list">
//       {products.map((product) => (
//         <div key={product.id} className="product">
//           <h2>{product.name.stringValue}</h2>
//           <p>{product.description.stringValue}</p>
//           <p>Price: ${(product.price.integerValue)}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ProductList;
