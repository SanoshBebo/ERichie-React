import axios from 'axios';

// Function to fetch items from Firestore
async function fetchItems() {
  try {
    const response = await axios.get(
      'https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products'
    );

    const itemList = response.data.documents.map((doc) => ({
      id: doc.name.split('/').pop(), // Extract the document ID
      productname: doc.fields.productname.stringValue || '',
      price: doc.fields.price.integerValue || 0,
      imageurl: doc.fields.imageurl.stringValue || '',
      category: doc.fields.category.stringValue || '',
      description: doc.fields.description.stringValue || '',
      stock: doc.fields.stock.integerValue || 0,
      shopid: doc.fields.shopid.stringValue || '',
    }));
    const filteredItemList = itemList.filter((item) => item.stock > 0);

    return filteredItemList.map((item) => ({
        id: item.id,
        productname: item.productname,
        price: item.price,
        imageurl: item.imageurl,
        category: item.category,
        description: item.description,
        stock: item.stock,
        shopid: item.shopid,
      }));
    } catch (error) {
      console.error('Error fetching data: ', error);
      return [];
  }
}

export default fetchItems;
