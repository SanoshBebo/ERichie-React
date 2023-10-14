import axios from "axios";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents";

export const fetchShopFourteenProducts = async () => {
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
          const fields = document.fields;

          // Define a function to handle fields based on their existence
          const handleField = (fieldName) => {
            const stringValue = fields[fieldName]?.stringValue;
            const integerValue = fields[fieldName]?.integerValue;
            return stringValue
              ? parseInt(stringValue, 10)
              : integerValue || null;
          };

          const description = fields.description.stringValue;

          const stock = handleField("stock");

          const price = handleField("price");

          const productname = fields.productname.stringValue;

          const shopid = fields.shopid.stringValue;

          const category = fields.category.stringValue;

          const imageurl =
            fields.imageUrl?.stringValue || fields.imageurl?.stringValue;

          return {
            description,
            stock,
            price,
            productname,
            shopid,
            category,
            imageurl,
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
