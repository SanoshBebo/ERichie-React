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
  "https://firestore.googleapis.com/v1/projects/erichieplatform/databases/(default)/documents";

export const fetchCart = async (loggedInEmail) => {
  const cartApiUrl = `${baseUrl}/Carts`; // Use a different URL for cart data
  let shopProducts = [];
  try {
    const cartResponse = await axios.get(cartApiUrl);

    if (cartResponse.status === 200) {
      const cartResponseData = cartResponse.data;

      if (cartResponseData.documents) {
        const cartDocuments = cartResponseData.documents;

        const cartData = await Promise.all(
          cartDocuments
            .filter((document) => {
              const { email } = document.fields;
              return email.stringValue == loggedInEmail; // replace dynamically for user later
            })
            .map(async (document) => {
              const documentNameParts = document.name.split("/");
              const documentId =
                documentNameParts[documentNameParts.length - 1];
              const { email, productid, quantity, shopid } = document.fields;

              if (shopid.stringValue == "shop01") {
                const res = await fetchShopOneProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop02") {
                const res = await fetchShopTwoProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop03") {
                const res = await fetchShopThreeProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop04") {
                const res = await fetchShopFourProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop05") {
                const res = await fetchShopFiveProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop06") {
                const res = await fetchShopSixProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop07") {
                const res = await fetchShopSevenProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop09") {
                const res = await fetchShop09();
                shopProducts = res;
              } else if (shopid.stringValue == "shop10") {
                const res = await fetchShop10();
                shopProducts = res;
              } else if (shopid.stringValue == "shop11") {
                const res = await fetchShop11();
                shopProducts = res;
              } else if (shopid.stringValue == "shop12") {
                const res = await fetchShop12();
                shopProducts = res;
              } else if (shopid.stringValue == "shop13") {
                const res = await fetchShopThirteenProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop14") {
                const res = await fetchShopFourteenProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop15") {
                const res = await fetchShopFifteenProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop16") {
                const res = await fetchShopSixteenProducts();
                shopProducts = res;
              } else if (shopid.stringValue == "shop17") {
                const res = await fetchShopSeventeenProducts();
                shopProducts = res;
              }

              // Find the corresponding product data based on product ID
              console.log(shopProducts);
              const product = shopProducts.find(
                (product) => product.productid === productid.stringValue
              );
              console.log(product);
              console.log(document);

              return {
                email: email.stringValue,
                quantity: quantity.integerValue,
                description: product.description,
                stock: product.stock,
                price: product.price,
                shopid: product.shopid,
                productname: product.productname,
                category: product.category,
                imageurl: product.imageurl,
                productid: product.productid,
                cartid: documentId,
              };
            })
        );

        console.log(cartData);
        return cartData;
      } else {
        console.log("No cart documents found in the collection.");
        return [];
      }
    } else {
      console.error("Error fetching cart data:", cartResponse.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const addCartToFirestore = async (item, loggedInEmail) => {
  try {
    const collectionName = "Carts";
    const apiUrl = `${baseUrl}/${collectionName}`;
    console.log(item, "this is the item");

    // Check if there are any existing documents in Firestore
    const existingItemResponse = await axios.get(apiUrl);

    if (existingItemResponse.data.documents) {
      const cartDocuments = existingItemResponse.data.documents;

      // Filter cart data to find items matching customer and product IDs
      const cartItemToUpdate = cartDocuments.find((document) => {
        const { productid, email } = document.fields;
        return (
          productid.stringValue === item.id &&
          email.stringValue === loggedInEmail
        );
      });

      if (cartItemToUpdate) {
        // If the item already exists, update the quantity field
        const documentNameParts = cartItemToUpdate.name.split("/");
        const documentId = documentNameParts[documentNameParts.length - 1];
        const updateUrl = `${apiUrl}/${documentId}`;

        // Parse the existing quantity and stock as integers
        const existingQuantity = parseInt(
          cartItemToUpdate.fields.quantity.integerValue,
          10
        );
        const stock = parseInt(item.stock, 10);

        // Check if the selected quantity exceeds available stock
        if (existingQuantity + parseInt(item.quantity, 10) <= stock) {
          // Calculate the updated quantity by adding to the existing quantity
          const updatedQuantity =
            existingQuantity + parseInt(item.quantity, 10);

          // Update the quantity field with the calculated quantity
          const updatedFields = {
            ...cartItemToUpdate.fields,
            quantity: { integerValue: updatedQuantity },
          };

          const payload = {
            fields: updatedFields,
          };

          const response = await axios.patch(updateUrl, payload);

          if (response.status === 200) {
            console.log("Cart item updated successfully:", response.data);
          } else {
            console.error("Error updating cart item:", response.statusText);
            console.error("Response data:", response.data);
          }
        } else {
          // If the selected quantity exceeds the stock, set the quantity to the stock
          const updatedFields = {
            ...cartItemToUpdate.fields,
            quantity: { integerValue: stock },
          };

          const payload = {
            fields: updatedFields,
          };

          const response = await axios.patch(updateUrl, payload);

          if (response.status === 200) {
            console.log(
              "Cart item updated with maximum available quantity:",
              response.data
            );
          } else {
            console.error(
              "Error updating cart item with maximum available quantity:",
              response.statusText
            );
            console.error("Response data:", response.data);
          }
        }
      } else {
        // If the item does not exist, create a new document
        const payload = {
          fields: {
            productid: { stringValue: item.id },
            quantity: { integerValue: parseInt(item.quantity, 10) },
            email: { stringValue: loggedInEmail },
            shopid: { stringValue: item.shopid },
          },
        };

        const response = await axios.post(apiUrl, payload);

        if (response.status === 200) {
          console.log("Cart product added successfully:", response.data);
        } else {
          console.error("Error adding new product:", response.statusText);
          console.error("Response data:", response.data);
        }
      }
    } else {
      // If no documents exist, create a new document
      const payload = {
        fields: {
          productid: { stringValue: item.id },
          quantity: { integerValue: parseInt(item.quantity, 10) },
          email: { stringValue: loggedInEmail },
          shopid: { stringValue: item.shopid },
        },
      };

      const response = await axios.post(apiUrl, payload);

      if (response.status === 200) {
        console.log("Cart product added successfully:", response.data);
      } else {
        console.error("Error adding new product:", response.statusText);
        console.error("Response data:", response.data);
      }
    }
  } catch (error) {
    console.error("Error adding/updating product:", error);
  }
};

export const removeItemFromCartFirestore = async (loggedInEmail, productId) => {
  try {
    const collectionName = "Carts";
    const apiUrl = `${baseUrl}/${collectionName}`;
    const responseData = await axios.get(apiUrl);

    if (responseData.data.documents) {
      const cartDocuments = responseData.data.documents;

      // Filter cart data to find items matching customer and product IDs
      const cartItemsToDelete = cartDocuments.filter((document) => {
        const { productid, email } = document.fields;
        return (
          productid.stringValue === productId &&
          email.stringValue === loggedInEmail
        );
      });

      // Delete each item that matches the criteria
      for (const item of cartItemsToDelete) {
        const documentNameParts = item.name.split("/");
        const documentId = documentNameParts[documentNameParts.length - 1];
        const deleteUrl = `${apiUrl}/${documentId}`;
        await axios.delete(deleteUrl);
      }

      console.log("Cart items removed successfully.");
    } else {
      console.log("No documents found in the collection.");
    }
  } catch (error) {
    console.error("Error removing cart items:", error);
  }
};

export const updateCartFirestore = async (
  loggedInEmail,
  productId,
  newQuantity
) => {
  try {
    const collectionName = "Carts";
    const apiUrl = `${baseUrl}/${collectionName}`;
    const responseData = await axios.get(apiUrl);

    if (responseData.data.documents) {
      const cartDocuments = responseData.data.documents;

      // Find the cart item that matches the customer and product IDs
      const cartItemToUpdate = cartDocuments.find((document) => {
        const { productid, email } = document.fields;
        return (
          productid.stringValue === productId &&
          email.stringValue === loggedInEmail
        );
      });

      if (cartItemToUpdate) {
        const documentNameParts = cartItemToUpdate.name.split("/");
        const documentId = documentNameParts[documentNameParts.length - 1];
        const updateUrl = `${apiUrl}/${documentId}`;

        // Get the existing fields and update the quantity field
        const existingFields = { ...cartItemToUpdate.fields };
        existingFields.quantity = { integerValue: newQuantity };

        // Update the quantity in Firestore
        const payload = {
          fields: existingFields,
        };

        const response = await axios.patch(updateUrl, payload);

        if (response.status === 200) {
          console.log("Cart item updated successfully:", response.data);
        } else {
          console.error("Error updating cart item:", response.statusText);
          console.error("Response data:", response.data);
        }
      } else {
        console.log("Cart item not found.");
      }
    } else {
      console.log("No documents found in the collection.");
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
};
