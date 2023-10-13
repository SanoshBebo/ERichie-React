export const getSalesByCategory = async () => {
  const ordersApiUrl = `${baseUrl}/Orders`;
  try {
    const allOrdersResponse = await axios.get(ordersApiUrl);
    const products = [];
    let mediaSales = 0;
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
              .filter(
                (document) => document.fields.category.stringValue === "media"
              )
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
                  category,
                } = document.fields;

                mediaSales += totalprice;

                console.log(document);
                console.log(shopid.stringValue);
                const shopProducts = await fetchShopProducts(
                  shopid.stringValue
                );
                console.log(shopProducts);
                const productInfo = shopProducts.find(
                  (prod) => prod.productid === productid.stringValue
                );

                return {
                  productname: productInfo.productname,
                  imageurl: productInfo.imageurl,
                  productid: productid.stringValue,
                  purchaseDate: purchasedate.timestampValue,
                  quantity: quantity.integerValue,
                  description: productInfo.description,
                  totalprice: totalprice.integerValue,
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
