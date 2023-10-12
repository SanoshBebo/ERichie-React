import axios from "axios";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/crud-550f3/databases/(default)/documents";

export const fetchShopSeventeenProducts = async () => {
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
