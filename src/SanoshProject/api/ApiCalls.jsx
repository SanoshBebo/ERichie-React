import axios from "axios";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents";

// function to fetch the product data
export const fetchProducts = async () => {
  const apiUrl = `${baseUrl}/Products`;

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

export const fetchCart = async (useruid) => {
  const cartApiUrl = `${baseUrl}/Carts`; // Use a different URL for cart data
  const productApiUrl = `${baseUrl}/Products`; // URL for product data

  try {
    const cartResponse = await axios.get(cartApiUrl);

    if (cartResponse.status === 200) {
      const cartResponseData = cartResponse.data;

      if (cartResponseData.documents) {
        const cartDocuments = cartResponseData.documents;

        const productResponse = await axios.get(productApiUrl); // Fetch product data

        if (productResponse.status === 200) {
          const productResponseData = productResponse.data;

          if (productResponseData.documents) {
            const productDocuments = productResponseData.documents;

            // Fetch product data from Firestore
            const productData = productDocuments.map((document) => {
              const documentNameParts = document.name.split("/");
              const documentId =
                documentNameParts[documentNameParts.length - 1];
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

            const cartData = cartDocuments
              .filter((document) => {
                const { customerid } = document.fields;
                return customerid.stringValue == useruid; //replace dynamically for user later
              })
              .map((document) => {
                const documentNameParts = document.name.split("/");
                const documentId =
                  documentNameParts[documentNameParts.length - 1];
                const { customerid, productid, quantity } = document.fields;

                // Find the corresponding product data based on product ID
                const product = productData.find(
                  (product) => product.productid === productid.stringValue
                );

                return {
                  customerid: customerid.stringValue,
                  quantity: quantity.integerValue,
                  description: product.description,
                  stock: product.stock,
                  price: product.price,
                  productname: product.productname,
                  category: product.category,
                  imageurl: product.imageurl,
                  productid: product.productid,
                  cartid: documentId,
                };
              });
            return cartData;
          } else {
            console.log("No product documents found in the collection.");
            return [];
          }
        } else {
          console.error(
            "Error fetching product data:",
            productResponse.statusText
          );
          return [];
        }
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

export const addCartToFirestore = async (item, useruid) => {
  try {
    const collectionName = "Carts";
    const apiUrl = `${baseUrl}/${collectionName}`;

    // Check if there are any existing documents in Firestore
    const existingItemResponse = await axios.get(apiUrl);

    if (existingItemResponse.data.documents) {
      const cartDocuments = existingItemResponse.data.documents;

      // Filter cart data to find items matching customer and product IDs
      const cartItemToUpdate = cartDocuments.find((document) => {
        const { productid, customerid } = document.fields;
        return (
          productid.stringValue === item.id &&
          customerid.stringValue === useruid
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
            customerid: { stringValue: useruid },
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
          customerid: { stringValue: useruid },
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

export const removeItemFromCartFirestore = async (customerId, productId) => {
  try {
    const collectionName = "Carts";
    const apiUrl = `${baseUrl}/${collectionName}`;
    const responseData = await axios.get(apiUrl);

    if (responseData.data.documents) {
      const cartDocuments = responseData.data.documents;

      // Filter cart data to find items matching customer and product IDs
      const cartItemsToDelete = cartDocuments.filter((document) => {
        const { productid, customerid } = document.fields;
        return (
          productid.stringValue === productId &&
          customerid.stringValue === customerId
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
  customerId,
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
        const { productid, customerid } = document.fields;
        return (
          productid.stringValue === productId &&
          customerid.stringValue === customerId
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
