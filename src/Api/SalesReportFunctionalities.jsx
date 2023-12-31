import axios from "axios";
import { fetchShopProducts } from "./Orders";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/erichieplatform/databases/(default)/documents";
export const getSalesByCategory = async () => {
  const ordersApiUrl = `${baseUrl}/Orders`;
  try {
    const allOrdersResponse = await axios.get(ordersApiUrl);
    let mediaSales = 0;
    let computerSales = 0;
    let gamingSales = 0;
    let mobileSales = 0;

    let mediaProducts = {};
    let computerProducts = {};
    let gamingProducts = {};
    let mobileProducts = {};

    let topSellingMediaProducts = [];
    let bottomSellingMediaProducts = [];
    let topSellingMobileProducts = [];
    let bottomSellingMobileProducts = [];
    let topSellingGamingProducts = [];
    let bottomSellingGamingProducts = [];
    let topSellingComputerProducts = [];
    let bottomSellingComputerProducts = [];
    // Iterate through all orders
    const shopSales = {}; // Create a dictionary to store shop sales
    const shops = [
      "shop01",
      "shop02",
      "shop03",
      "shop04",
      "shop05",
      "shop06",
      "shop07",
      "shop09",
      "shop10",
      "shop11",
      "shop12",
      "shop13",
      "shop14",
      "shop15",
      "shop16",
      "shop17",
    ];

    for (const shop of shops) {
      shopSales[shop] = 0; // Initialize shop sales for each shop to 0
    }

    await Promise.all(
      allOrdersResponse.data.documents.map(async (orderDocument) => {
        const orderId = orderDocument.name.split("/").pop(); // Extract the order ID
        if (orderDocument) {
          const productsSubcollectionUrl = `${ordersApiUrl}/${orderId}/OrderedProducts`;
          const productsResponse = await axios.get(productsSubcollectionUrl);
          const orderDocuments = productsResponse.data.documents;

          await Promise.all(
            orderDocuments
              .filter(
                (document) =>
                  document.fields.category.stringValue.toLowerCase() === "media"
              )
              .map(async (document) => {
                console.log(document);
                const documentNameParts = document.name.split("/");
                const documentId =
                  documentNameParts[documentNameParts.length - 1];
                const { productid, totalprice, shopid } = document.fields;
                console.log(totalprice);
                mediaSales += parseInt(totalprice.integerValue, 10);
                console.log(mediaSales);
                if (mediaProducts[productid.stringValue]) {
                  mediaProducts[productid.stringValue].totalsales +=
                    totalprice.integerValue;
                } else {
                  const shopProducts = await fetchShopProducts(
                    shopid.stringValue
                  );
                  console.log(shopProducts);
        
                    const productInfo = shopProducts.find(
                      (prod) => prod?.productid === productid?.stringValue
                    );
                      if(productInfo){
                                          console.log(productInfo);
                                          // If the product is not in the dictionary, add it
                                          mediaProducts[productid.stringValue] = {
                                            productInfo,
                                            totalsales: totalprice.integerValue,
                                          };

                      }
                  console.log(mediaProducts);
                }
              })
          );
          await Promise.all(
            orderDocuments
              .filter(
                (document) =>
                  document.fields.category.stringValue.toLowerCase() ===
                  "computer"
              )
              .map(async (document) => {
                console.log(document);

                const documentNameParts = document.name.split("/");
                const documentId =
                  documentNameParts[documentNameParts.length - 1];
                const { productid, totalprice, shopid } = document.fields;

                computerSales += parseInt(totalprice.integerValue, 10);
                console.log(computerSales);
                if (computerProducts[productid.stringValue]) {
                  computerProducts[productid.stringValue].totalsales +=
                    totalprice.integerValue;
                } else {
                  const shopProducts = await fetchShopProducts(
                    shopid.stringValue
                  );
                  const productInfo = shopProducts.find(
                    (prod) => prod.productid === productid.stringValue
                  );
                  console.log(productInfo);
                  if(productInfo){

                    // If the product is not in the dictionary, add it
                    computerProducts[productid.stringValue] = {
                      productInfo,
                      totalsales: totalprice.integerValue,
                    };
                    console.log(computerProducts);
                  }
                }
              })
          );
          await Promise.all(
            orderDocuments
              .filter(
                (document) =>
                  document.fields.category.stringValue.toLowerCase() ===
                  "mobile"
              )
              .map(async (document) => {
                const documentNameParts = document.name.split("/");
                const documentId =
                  documentNameParts[documentNameParts.length - 1];
                const { productid, totalprice, shopid } = document.fields;

                mobileSales += parseInt(totalprice.integerValue, 10);
                console.log(mobileSales);

                if (mobileProducts[productid.stringValue]) {
                  mobileProducts[productid.stringValue].totalsales +=
                    totalprice.integerValue;
                } else {
                  const shopProducts = await fetchShopProducts(
                    shopid.stringValue
                  );
                  console.log(shopProducts);
                  const productInfo = shopProducts.find(
                    (prod) => prod.productid === productid.stringValue
                  );
                  console.log(productInfo);
                  // If the product is not in the dictionary, add it
                  if(productInfo){

                    mobileProducts[productid.stringValue] = {
                      productInfo,
                      totalsales: totalprice.integerValue,
                    };
                    console.log(mobileProducts);
                  }
                }
              })
          );

          await Promise.all(
            orderDocuments
              .filter(
                (document) =>
                  document.fields.category.stringValue.toLowerCase() ===
                  "gaming"
              )
              .map(async (document) => {
                console.log(document);
                const documentNameParts = document.name.split("/");
                const documentId =
                  documentNameParts[documentNameParts.length - 1];
                const { productid, totalprice, shopid } = document.fields;

                gamingSales += parseInt(totalprice.integerValue, 10);
                console.log(gamingSales);
                if (gamingProducts[productid.stringValue]) {
                  gamingProducts[productid.stringValue].totalsales +=
                    totalprice.integerValue;
                } else {
                  const shopProducts = await fetchShopProducts(
                    shopid.stringValue
                  );
                  console.log(shopProducts);
                  const productInfo = shopProducts.find(
                    (prod) => prod.productid === productid.stringValue
                  );
                  console.log(productInfo);
                  if(productInfo){

                    // If the product is not in the dictionary, add it
                    gamingProducts[productid.stringValue] = {
                      productInfo,
                      totalsales: totalprice.integerValue,
                    };
                    console.log(gamingProducts);
                  }
                }
              })
          );

          for (const orderDocument of orderDocuments) {
            const shopId = orderDocument.fields.shopid.stringValue;
            if (shopSales[shopId] !== undefined) {
              shopSales[shopId] += parseInt(
                orderDocument.fields.totalprice.integerValue,
                10
              );
            }
          }

          const mediaProductSalesArray = Object.values(mediaProducts);

          // Sort products by total sales in descending order
          mediaProductSalesArray.sort((a, b) => b.totalsales - a.totalsales);

          // Get the top 5 and bottom 5 products
          topSellingMediaProducts = mediaProductSalesArray.slice(0, 5);
          bottomSellingMediaProducts = mediaProductSalesArray.slice(-5);

          const computerProductSalesArray = Object.values(computerProducts);

          // Sort products by total sales in descending order
          computerProductSalesArray.sort((a, b) => b.totalsales - a.totalsales);

          // Get the top 5 and bottom 5 products
          topSellingComputerProducts = computerProductSalesArray.slice(0, 5);
          bottomSellingComputerProducts = computerProductSalesArray.slice(-5);

          const mobileProductSalesArray = Object.values(mobileProducts);

          // Sort products by total sales in descending order
          mobileProductSalesArray.sort((a, b) => b.totalsales - a.totalsales);

          // Get the top 5 and bottom 5 products
          topSellingMobileProducts = mobileProductSalesArray.slice(0, 5);
          bottomSellingMobileProducts = mobileProductSalesArray.slice(-5);

          const gamingProductSalesArray = Object.values(gamingProducts);

          // Sort products by total sales in descending order
          gamingProductSalesArray.sort((a, b) => b.totalsales - a.totalsales);

          // Get the top 5 and bottom 5 products
          topSellingGamingProducts = gamingProductSalesArray.slice(0, 5);
          bottomSellingGamingProducts = gamingProductSalesArray.slice(-5);
        }
      })
    );

    return {
      shopSales,
      topSellingMediaProducts,
      bottomSellingMediaProducts,
      topSellingMobileProducts,
      bottomSellingMobileProducts,
      topSellingGamingProducts,
      bottomSellingGamingProducts,
      topSellingComputerProducts,
      bottomSellingComputerProducts,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
