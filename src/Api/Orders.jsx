import axios from "axios";
import { fetchShopOneProducts } from "./fetchShopOneProducts";
import { fetchShopTwoProducts } from "./fetchShopTwoProducts";
import { fetchShopThreeProducts } from "./fetchShopThreeProducts";
import { fetchShop09 } from "./fetchShop09";
import { fetchShop10 } from "./fetchShop10";
import { fetchShop11 } from "./fetchShop11";
import { fetchShop12 } from "./fetchShop12";
import { fetchShopThirteenProducts } from "./fetchShopThirteenProducts";
import { fetchShopFourteenProducts } from "./fetchShopFourteenProducts";
import { fetchShopFifteenProducts } from "./fetchShopFifteenProducts";
import { fetchShopSixteenProducts } from "./fetchShopSixteenProducts";
import { fetchShopSeventeenProducts } from "./fetchShopSeventeenProducts";
import { fetchShopSevenProducts } from "./fetchShopSevenProducts";
import { fetchShopSixProducts } from "./fetchShopSixProducts";
import { fetchShopFiveProducts } from "./fetchShopFiveProducts";
import { fetchShopFourProducts } from "./fetchShopFourProducts";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/erichiewebsite/databases/(default)/documents";

export const fetchShopProducts = async (shopid) => {
  if (shopid == "shop01") {
    return await fetchShopOneProducts();
  } else if (shopid == "shop02") {
    return await fetchShopTwoProducts();
  } else if (shopid == "shop03") {
    return await fetchShopThreeProducts();
  } else if (shopid == "shop04") {
    return await fetchShopFourProducts();
  } else if (shopid == "shop05") {
    return await fetchShopFiveProducts();
  } else if (shopid == "shop06") {
    return await fetchShopSixProducts();
  } else if (shopid == "shop07") {
    return await fetchShopSevenProducts();
  } else if (shopid == "shop09") {
    return await fetchShop09();
  } else if (shopid == "shop10") {
    return await fetchShop10();
  } else if (shopid == "shop11") {
    return await fetchShop11();
  } else if (shopid == "shop12") {
    return await fetchShop12();
  } else if (shopid == "shop13") {
    return await fetchShopThirteenProducts();
  } else if (shopid == "shop14") {
    return await fetchShopFourteenProducts();
  } else if (shopid == "shop15") {
    return await fetchShopFifteenProducts();
  } else if (shopid == "shop16") {
    return await fetchShopSixteenProducts();
  } else if (shopid == "shop17") {
    return await fetchShopSeventeenProducts();
  }
};

export const storePurchaseInFirestore = async (cartItems, loggedinEmail) => {
  const ordersApiUrl = `${baseUrl}/Orders`;
  let shopProducts = [];
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
          category: { stringValue: product.category },
        };
        console.log(payload);
        await axios.post(`${ordersApiUrl}/${orderid}/OrderedProducts`, {
          fields: payload,
        });

        const res = await fetchShopProducts(product.shopid);
        shopProducts = res;

        console.log(shopProducts);
        // Find the corresponding product in productData
        const productDocument = shopProducts.find((document) => {
          return document.productid === product.productid;
        });

        console.log(productDocument);

        if (productDocument) {
          const existingStock = parseInt(productDocument.stock, 10);
          console.log("existing stock: ", existingStock);
          const updatedStock = existingStock - parseInt(product.quantity, 10);
          console.log("updatedStock stock: ", updatedStock);

          console.log(productDocument);

          let updateStockPayload;
          // Create a payload to update the product's stock
          if (productDocument.shopid.toLowerCase() == "shop10") {
            console.log(productDocument);
            updateStockPayload = {
              fields: {
                description: { stringValue: productDocument.description },
                productname: { stringValue: productDocument.productname },
                shopid: { stringValue: productDocument.shopid },
                category: { stringValue: productDocument.category },
                imageurl: { stringValue: productDocument.imageurl },
                price: { integerValue: productDocument.price },
                stock: { integerValue: updatedStock }, // Update stock field
                type: { stringValue: productDocument.type },
              },
            };
          } else {
            updateStockPayload = {
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
          }
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
      "https://firestore.googleapis.com/v1/projects/dead-eye-game-store/databases/(default)/documents/Products",
    shop06:
      "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents/Products",
    shop07:
      "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products",
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
      "https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products",
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

export const getOrderHistory = async (email) => {
  const ordersApiUrl = `${baseUrl}/Orders`;
  try {
    const allOrdersResponse = await axios.get(ordersApiUrl);
    const orders = [];

    // Helper function to fetch shop product
    // Iterate through all orders
    await Promise.all(
      allOrdersResponse.data.documents.map(async (orderDocument) => {
        const orderId = orderDocument.name.split("/").pop(); // Extract the order ID
        if (orderDocument) {
          const productsSubcollectionUrl = `${ordersApiUrl}/${orderId}/OrderedProducts`;
          const productsResponse = await axios.get(productsSubcollectionUrl);
          const orderDocuments = productsResponse.data.documents;

          const orderData = await Promise.all(
            orderDocuments
              .filter((document) => document.fields.email.stringValue === email)
              .map(async (document) => {
                const documentNameParts = document.name.split("/");
                const documentId =
                  documentNameParts[documentNameParts.length - 1];
                const {
                  productid,
                  purchasedate,
                  quantity,
                  totalprice,
                  shopid,
                  email,
                } = document.fields;

                console.log(document);
                console.log(shopid.stringValue);

                let productInfo = null;
                try {
                  const shopProducts = await fetchShopProducts(
                    shopid.stringValue
                  );
                  console.log(shopProducts);
                  productInfo = shopProducts.find(
                    (prod) => prod.productid === productid.stringValue
                  );
                  console.log(productInfo);
                } catch (error) {
                  console.error("Error fetching shop products: ", error);
                }

                return {
                  productname: productInfo.productname
                    ? productInfo.productname
                    : productInfo.name,
                  imageurl: productInfo.imageUrl
                    ? productInfo.imageUrl
                    : productInfo.imageurl,
                  productid: productid.stringValue
                    ? productid.stringValue
                    : id.stringValue,
                  purchaseDate: purchasedate.timestampValue
                    ? purchasedate.timestampValue
                    : purchaseDate.timestampValue,
                  quantity: quantity ? quantity.integerValue : 0,
                  description: productInfo
                    ? productInfo.description
                    : "Unknown",
                  totalprice: totalprice ? totalprice.integerValue : 0,
                  shopid: shopid.stringValue,
                  email: email.stringValue,
                  orderid: orderId,
                };
              })
          );
          console.log(orderData);
          orders.push(...orderData);
        }
      })
    );
    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
