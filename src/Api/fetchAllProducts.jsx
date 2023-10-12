import { fetchShopFourProducts } from "./fetchShopFourProducts";
import { fetchShopOneProducts } from "./fetchShopOneProducts";
import { fetchShopThreeProducts } from "./fetchShopThreeProducts";
import { fetchShopTwoProducts } from "./fetchShopTwoProducts";
// import { fetchShopFiveProducts } from "./fetchShopFiveProducts";
import { fetchShopThirteenProducts } from "./fetchShopThirteenProducts";
import { fetchShopSeventeenProducts } from "./fetchShopSeventeenProducts";
import { fetchShopFourteenProducts } from "./fetchShopFourteenProducts";
import {fetchShopFifteenProducts} from "./fetchShopFifteenProducts";
import {fetchShopSixteenProducts} from "./fetchShopSixteenProducts";

import {fetchShop09} from "./fetchShop09";
import {fetchShop10} from "./fetchShop10";
import {fetchShop11} from "./fetchShop11";
import {fetchShop12} from "./fetchShop12";
import { fetchShopFiveProducts } from "./fetchShopFiveProducts";

import { fetchShopSixProducts } from "./fetchShopSixProducts";

import { fetchShopSevenProduct } from "./fetchShopSevenProducts";



export const fetchAllProducts = async () => {
  try {
    // Make API calls to fetch products from different endpoints

    //mediaTeam
    const shopOneResponse = await fetchShopOneProducts();
    const shopTwoResponse = await fetchShopTwoProducts();
    const shopThreeResponse = await fetchShopThreeProducts();
    const shopFourResponse = await fetchShopFourProducts();

    // computerTeam
     // computerTeam
     const shopThirteenResponse = await fetchShopThirteenProducts();
     const shopSeventeenResponse = await fetchShopSeventeenProducts();
     const shopFourteenResponse = await fetchShopFourteenProducts();
     const shopFifteenProducts= await fetchShopFifteenProducts();
     const shopSixteenProducts = await fetchShopSixteenProducts();


     const shopNineProducts = await fetchShop09();
     const shopTenProducts = await fetchShop10();
     const shopelevenProducts = await fetchShop11();
     const shopTwelveProducts = await fetchShop12();

    // gaming team
    const shopFiveResponse = await fetchShopFiveProducts();

    const shopSixResponse = await fetchShopSixProducts();

    const shopSevenResponse = await fetchShopSevenProducts();

    // const shopFiveResponse = await fetchShopFiveProducts();

    // mobile team

    // Combine all products into a single array
    const allProducts = [
      ...shopOneResponse,
      ...shopTwoResponse,
      ...shopThreeResponse,
      ...shopFourResponse,
      ...shopThirteenResponse,
      // ...shopFiveResponse,
      ...shopThirteenResponse,
      ...shopSeventeenResponse,
      ...shopFourteenResponse,
      ...shopFifteenProducts,
      ...shopSixteenProducts,
      ...shopTwelveProducts,
      ...shopelevenProducts,
      ...shopTenProducts,
      ...shopNineProducts,
      ...shopFiveResponse,

      ...shopSixResponse,

      ...shopSevenResponse,

    ];

    // Update the state with the combined products
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
