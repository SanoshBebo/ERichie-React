import axios from "axios";
const baseUrl =
  "https://firestore.googleapis.com/v1/projects/e-richie-application/databases/(default)/documents";

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
        console.log(productData);
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

          // Create a payload to update the product's stock
          const updateStockPayload = {
            fields: {
              description: { stringValue: productDocument.description },
              productname: { stringValue: productDocument.productname },
              shopid: { stringValue: productDocument.shopid },
              category: { stringValue: productDocument.category },
              imageurl: { stringValue: productDocument.imageurl },
              productid: { stringValue: productDocument.productid },
              price: { integerValue: productDocument.price },
              stock: { integerValue: updatedStock }, // Update stock field
            },
          };
          console.log("updateStockPayload: ", updateStockPayload);

          // Update the product's stock in Firestore
          const updateStockResponse = axios.patch(
            `${productsApiUrl}/${productDocument.productid}`,
            updateStockPayload
          );
        }
      })
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
};

export const getOrderByDateFromFireStore = async () => {
  const allproducts = await fetchProducts();
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
              const purchaseDate = document.fields.purchaseDate.timestampValue;
              const purchaseDateStr = purchaseDate.split("T")[0]; // Extract the date part
              const todayDate = new Date().toISOString().split("T")[0];
              return purchaseDateStr === todayDate; // Compare with today's date
            })
            .map((document) => {
              const documentNameParts = document.name.split("/");
              const documentId =
                documentNameParts[documentNameParts.length - 1];
              const {
                productid,
                purchaseDate,
                quantity,
                totalprice,
                shopid,
                useruid,
              } = document.fields;

              const user = userDocuments.find((document) => {
                return (
                  document.fields.useruid.stringValue == useruid.stringValue
                );
              });

              const userInfo = user.fields;

              const productInfo = allproducts.find((prod) => {
                return prod.productid == productid.stringValue;
              });
              console.log(productInfo);
              return {
                name: userInfo.name.stringValue,
                productname: productInfo.productname,
                productid: productid.stringValue,
                purchaseDate: purchaseDate.timestampValue,
                quantity: quantity.integerValue,
                totalprice: totalprice.integerValue,
                shopid: shopid.stringValue,
                useruid: useruid.stringValue,
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

export const getOrderByDateRangeFromFireStore = async (startDate, endDate) => {
  const allproducts = await fetchProducts();
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
                document.fields.purchaseDate.timestampValue
              );
              // Set the time part of startDateCopy to the beginning of the day
              startDateCopy.setHours(0, 0, 0, 0);

              // Set the time part of endDateCopy to the end of the day
              endDateCopy.setHours(23, 59, 59, 999);
              // Compare purchaseDate with the specified date range
              return (
                purchaseDate >= startDateCopy && purchaseDate <= endDateCopy
              );
            })
            .map((document) => {
              const documentNameParts = document.name.split("/");
              const documentId =
                documentNameParts[documentNameParts.length - 1];
              const {
                productid,
                purchaseDate,
                quantity,
                totalprice,
                shopid,
                useruid,
              } = document.fields;

              const user = userDocuments.find((document) => {
                return (
                  document.fields.useruid.stringValue == useruid.stringValue
                );
              });

              const userInfo = user.fields;

              const productInfo = allproducts.find((prod) => {
                return prod.productid == productid.stringValue;
              });

              return {
                name: userInfo.name.stringValue,
                productname: productInfo.productname,
                productid: productid.stringValue,
                purchaseDate: purchaseDate.timestampValue,
                quantity: quantity.integerValue,
                totalprice: totalprice.integerValue,
                shopid: shopid.stringValue,
                useruid: useruid.stringValue,
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

export const getOrderDetailsByDateRange = async (startDate, endDate) => {
  const allproducts = await fetchProducts();
  try {
    const userApiUrl = `${baseUrl}/Users`;
    const userResponse = await axios.get(userApiUrl);
    const userDocuments = userResponse.data.documents;
    //
    const ordersApiUrl = `${baseUrl}/Orders`;

    const response = await axios.get(ordersApiUrl);

    if (response.status === 200) {
      const responseData = response.data;

      if (responseData.documents) {
        const orderDocuments = responseData.documents;

        const startDateCopy = new Date(startDate);
        const endDateCopy = new Date(endDate);

        const orderData = orderDocuments
          .filter((document) => {
            const purchaseDate = new Date(
              document.fields.purchaseDate.timestampValue
            );
            // Set the time part of startDateCopy to the beginning of the day
            startDateCopy.setHours(0, 0, 0, 0);

            // Set the time part of endDateCopy to the end of the day
            endDateCopy.setHours(23, 59, 59, 999);
            // Compare purchaseDate with the specified date range
            return purchaseDate >= startDateCopy && purchaseDate <= endDateCopy;
          })
          .map((document) => {
            const documentNameParts = document.name.split("/");
            const documentId = documentNameParts[documentNameParts.length - 1];
            const {
              productid,
              purchaseDate,
              quantity,
              totalprice,
              shopid,
              useruid,
            } = document.fields;

            const user = userDocuments.find((document) => {
              return document.fields.useruid.stringValue == useruid.stringValue;
            });

            const userInfo = user.fields;

            const productInfo = allproducts.find((prod) => {
              return prod.productid == productid.stringValue;
            });

            return {
              name: userInfo.name.stringValue,
              productname: productInfo.productname,
              productid: productid.stringValue,
              stock: productid.stock,
              purchaseDate: purchaseDate.timestampValue,
              quantity: quantity.integerValue,
              totalprice: totalprice.integerValue,
              shopid: shopid.stringValue,
              useruid: useruid.stringValue,
              orderid: documentId,
            };
          });
        console.log(orderData);
        return orderData;
      } else {
        console.log("No documents found in the collection.");
        return [];
      }
    } else {
      console.error("Error fetching product data:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
};
