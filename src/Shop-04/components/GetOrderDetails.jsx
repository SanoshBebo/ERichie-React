import axios from "axios";
const baseUrl =
  "https://firestore.googleapis.com/v1/projects/e-richie-application/databases/(default)/documents";

const fetchProducts=async ()=>{

        const apiUrl = `https://firestore.googleapis.com/v1/projects/d-richie-computers/databases/(default)/documents/Products`;
      
        try {
          const response = await axios.get(apiUrl);
      
          if (response.status === 200) {
            const responseData = response.data;
      
            if (responseData.documents) {
              const productDocuments = responseData.documents;
      
              const productData = productDocuments.map((document) => {
                const documentNameParts = document.name.split("/");
                const documentId = documentNameParts[documentNameParts.length - 1];
                const {
                  description,
                  stock,
                  price,
                  productname,
                  shopid,
                  category,
                  imageurl,
                } = document.fields;
                return {
                  description: description.stringValue,
                  stock: stock.integerValue,
                  price: price.integerValue,
                  productname: productname.stringValue,
                  shopid: shopid.stringValue,
                  category: category.stringValue,
                  imageurl: imageurl.stringValue,
                  productid: documentId,
                };
              });
              return productData;
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
              const purchaseDate = document.fields.purchasedate.timestampValue;
              const purchaseDateStr = purchaseDate.split("T")[0]; // Extract the date part
              const todayDate = new Date().toISOString().split("T")[0];
              return purchaseDateStr === todayDate && document.fields.shopid.stringValue == "shop16"; // Compare with today's date
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
                // console.log(document.fields.email.stringValue,email.stringValue)
                return (
                  document.fields.email.stringValue == email.stringValue
                );
              });

            //   console.log(user)
              const userInfo = user.fields;

              const productInfo = allproducts.find((prod) => {
                return prod.productid == productid.stringValue;
              });

            //   console.log(productInfo)
            //   console.log(productInfo);
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

        //   console.log(orderData);
          orders.push(...orderData);
        //   console.log(orders);
        }
      })
    );
    // console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};
