import axios from "axios";

import { fetchShop09 } from "../../../../Api/fetchShop09";
const baseUrl =
  "https://firestore.googleapis.com/v1/projects/erichieplatform/databases/(default)/documents";

export const getOrderByDateFromFireStore = async (shopid) => {
  console.log(shopid);

  const allproducts = await fetchShop09();
  const userApiUrl = `${baseUrl}/Users`;
  const userResponse = await axios.get(userApiUrl);
  const userDocuments = userResponse.data.documents;
  try {
    // Make a GET request to fetch all orders
    const today = new Date().toISOString().split("T")[0];
    const ordersApiUrl = `${baseUrl}/Orders`;

    const allOrdersResponse = await axios.get(ordersApiUrl);

    const orders = [];

    // Iterate through all orders
    await Promise.all(
      allOrdersResponse.data.documents.map(async (orderDocument) => {
        const orderId = orderDocument.name.split("/").pop(); // Extract the order ID
        const orderData = orderDocument.fields;
        // Check if the order document exists and has the "Products" subcollection
        if (orderDocument) {
          const productsSubcollectionUrl = `${ordersApiUrl}/${orderId}/OrderedProducts`;
          const productsResponse = await axios.get(productsSubcollectionUrl);
          const orderDocuments = productsResponse.data.documents;

          const orderData = orderDocuments
            .filter((document) => {
              const purchaseDate = document.fields.purchasedate.timestampValue;
              const purchaseDateStr = purchaseDate.split("T")[0]; // Extract the date part
              const todayDate = new Date().toISOString().split("T")[0];
              return (
                purchaseDateStr === todayDate &&
                document.fields.shopid.stringValue == shopid
              ); // Compare with today's date
            })
            .map((document) => {
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

              console.log(documentId);

              const user = userDocuments.find((document) => {
                console.log(
                  document.fields.email.stringValue,
                  email.stringValue
                );
                return document.fields.email.stringValue == email.stringValue;
              });

              console.log(user);
              const userInfo = user.fields;

              const productInfo = allproducts.find((prod) => {
                return prod.productid == productid.stringValue;
              });

              console.log(productInfo);

              return {
                name: userInfo.name.stringValue,
                productname: productInfo.productname,
                productid: productid.stringValue,
                purchaseDate: purchasedate.timestampValue,
                quantity: quantity.integerValue,
                totalprice: totalprice.integerValue,
                shopid: shopid.stringValue,
                email: email.stringValue,
                orderid: documentId,
                currentstock: productInfo.stock,
              };
            });

          console.log(orderData);
          orders.push(...orderData);
          console.log(orders);
        }
      })
    );
    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

export const getOrderByDateRangeFromFireStore = async (
  startDate,
  endDate,
  shopid
) => {
  const allproducts = await fetchShop09();
  const userApiUrl = `${baseUrl}/Users`;
  const userResponse = await axios.get(userApiUrl);
  const userDocuments = userResponse.data.documents;
  try {
    // Make a GET request to fetch all orders
    const today = new Date().toISOString().split("T")[0];
    const ordersApiUrl = `${baseUrl}/Orders`;

    const allOrdersResponse = await axios.get(ordersApiUrl);

    const orders = [];

    // Iterate through all orders
    await Promise.all(
      allOrdersResponse.data.documents.map(async (orderDocument) => {
        const orderId = orderDocument.name.split("/").pop(); // Extract the order ID
        const orderData = orderDocument.fields;
        // Check if the order document exists and has the "Products" subcollection
        if (orderDocument) {
          const productsSubcollectionUrl = `${ordersApiUrl}/${orderId}/OrderedProducts`;
          const productsResponse = await axios.get(productsSubcollectionUrl);
          const orderDocuments = productsResponse.data.documents;

          const startDateCopy = new Date(startDate);
          const endDateCopy = new Date(endDate);

          const orderData = orderDocuments
            .filter((document) => {
              const purchaseDate = new Date(
                document.fields.purchasedate.timestampValue
              );
              // Set the time part of startDateCopy to the beginning of the day
              startDateCopy.setHours(0, 0, 0, 0);

              // Set the time part of endDateCopy to the end of the day
              endDateCopy.setHours(23, 59, 59, 999);
              // Compare purchaseDate with the specified date range
              return (
                purchaseDate >= startDateCopy &&
                purchaseDate <= endDateCopy &&
                document.fields.shopid.stringValue == shopid
              );
            })
            .map((document) => {
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

              const user = userDocuments.find((document) => {
                return document.fields.email.stringValue == email.stringValue;
              });

              const userInfo = user.fields;

              console.log(userInfo);
              const productInfo = allproducts.find((prod) => {
                return prod.productid == productid.stringValue;
              });
              console.log(productInfo);

              console.log(document);
              return {
                name: userInfo.name.stringValue,
                productname: productInfo.productname,
                productid: productid.stringValue,
                purchaseDate: purchasedate.timestampValue,
                quantity: quantity.integerValue,
                totalprice: totalprice.integerValue,
                shopid: shopid.stringValue,
                email: email.stringValue,
                orderid: documentId,
              };
            });

          console.log(orderData);
          orders.push(...orderData);
          console.log(orders);
        }
      })
    );
    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};
