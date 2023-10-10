import axios from "axios";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents";

// function to fetch the product data
export const fetchProducts = async () => {
  const apiUrl = `${baseUrl}/Products`;

  try {
    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      const responseData = response.data;

      if (responseData.documents) {
        const cartDocuments = responseData.documents;

        const cartData = cartDocuments.map((document) => {
          const documentNameParts = document.name.split("/");
          const documentId = documentNameParts[documentNameParts.length - 1];
          const { description, stock, price, productname, imageurl } =
            document.fields;
          return {
            description: description.stringValue,
            stock: stock.integerValue,
            price: price.integerValue,
            productname: productname.stringValue,
            id: documentId,
            imageurl: imageurl.stringValue,
          };
        });

        return cartData;
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
