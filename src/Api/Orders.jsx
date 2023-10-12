import axios from "axios";
const baseUrl =
  "https://firestore.googleapis.com/v1/projects/erichieplatform/databases/(default)/documents";

export const storePurchaseInFirestore = async (
  allProducts,
  cartItems,
  loggedinEmail
) => {
  const ordersApiUrl = `${baseUrl}/Orders`;

  try {
    const orderResponse = await axios.post(`${ordersApiUrl}`, {
      fields: {},
    });
    const orderid = orderResponse.data.name.split("/").pop();

    // Use Promise.all to make multiple async requests concurrently
    await Promise.all(
      cartItems.map(async (product) => {
        console.log(product);
        const totalprice =
          parseInt(product.quantity, 10) * parseInt(product.price, 10);
        const payload = {
          quantity: { integerValue: parseInt(product.quantity, 10) },
          shopid: { stringValue: product.shopid },
          totalprice: { integerValue: totalprice },
          email: { stringValue: loggedinEmail },
          purchasedate: { timestampValue: new Date().toISOString() },
          productid: { stringValue: product.productid },
        };
        console.log(payload);
        await axios.post(`${ordersApiUrl}/${orderid}/OrderedProducts`, {
          fields: payload,
        });
        // Find the corresponding product in productData
        const productDocument = allProducts.find((document) => {
          return document.productid === product.productid;
        });

        console.log(productDocument);

        if (productDocument) {
          const existingStock = parseInt(productDocument.stock, 10);
          console.log("existing stock: ", existingStock);
          const updatedStock = existingStock - parseInt(product.quantity, 10);
          console.log("updatedStock stock: ", updatedStock);

          console.log(productDocument);
          // Create a payload to update the product's stock
          const updateStockPayload = {
            fields: {
              description: { stringValue: productDocument.description },
              productname: { stringValue: productDocument.productname },
              shopid: { stringValue: productDocument.shopid },
              category: { stringValue: productDocument.category },
              imageurl: { stringValue: productDocument.imageurl },
              price: { integerValue: productDocument.price },
              stock: { integerValue: updatedStock }, // Update stock field
            },
          };
          console.log("updateStockPayload: ", updateStockPayload);

          //To update the stock
          updateStock(
            productDocument.shopid,
            updateStockPayload,
            productDocument
          );
          // Update the product's stock in Firestore
        }
      })
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
};

const updateStock = async (shopid, updateStockPayload, productDocument) => {
  // Define a mapping of shopid values to their respective URLs
  const shopUrls = {
    shop01:
      "https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents/Products",
    shop02:
      "https://firestore.googleapis.com/v1/projects/e-ritchie/databases/(default)/documents/Products",
    shop03:
      "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents/Products",
    shop04:
      "https://firestore.googleapis.com/v1/projects/supreme-mart/databases/(default)/documents/products",
    shop05:
      "https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents/Products",
    shop6:
      "https://firestore.googleapis.com/v1/projects/e-ritchie/databases/(default)/documents/Products",
    shop07:
      "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents/Products",
    shop08:
      "https://firestore.googleapis.com/v1/projects/supreme-mart/databases/(default)/documents/Products",
    shop09:
      "https://firestore.googleapis.com/v1/projects/shank-mobiles/databases/(default)/documents/Products",
    shop10:
      "https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Products",
    shop11:
      "https://firestore.googleapis.com/v1/projects/e-mobile-81b40/databases/(default)/documents/Products",
    shop12:
      "https://firestore.googleapis.com/v1/projects/mobileworld-160ce/databases/(default)/documents/Products",
    shop13:
      "https://firestore.googleapis.com/v1/projects/abhiram-store/databases/(default)/documents/Products",
    shop14:
      "https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products",
    shop15:
      "https://firestore.googleapis.com/v1/projects/adminstore-196a7/databases/(default)/documents/Products",
    shop16:
      "https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products",
    
    shop17:
      "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents/Products",
    
    
    
    
    
    
      // Add more shop URLs as needed
  };

  const apiUrl = shopUrls[shopid];

  if (apiUrl) {
    try {
      const response = await axios.patch(
        `${apiUrl}/${productDocument.productid}`,
        updateStockPayload
      );
      console.log("Data updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  } else {
    console.error("Invalid shopid:", shopid);
  }
};
