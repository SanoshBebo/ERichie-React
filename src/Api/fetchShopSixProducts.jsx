

import axios from "axios";







const baseUrl =



  "https://firestore.googleapis.com/v1/projects/gamestore-1b041/databases/(default)/documents";







export const fetchShopSixProducts = async () => {



  const apiUrl = `${baseUrl}/products`;







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



            imageUrl,



          } = document.fields;



          return {



            description: description.stringValue,



            stock: stock.integerValue,



            price: price.doubleValue,



            productname: productname.stringValue,



            shopid: shopid.stringValue,



            category: category.stringValue,



            imageurl: imageUrl.stringValue,



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



