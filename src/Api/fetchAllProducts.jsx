import { fetchShopFourProducts } from "./fetchShopFourProducts";
import { fetchShopOneProducts } from "./fetchShopOneProducts";
import { fetchShopThreeProducts } from "./fetchShopThreeProducts";
import { fetchShopTwoProducts } from "./fetchShopTwoProducts";
import { fetchShopThirteenProducts } from "./fetchShopThirteenProducts";

export const fetchAllProducts = async () => {
  try {
    // Make API calls to fetch products from different endpoints

    //mediaTeam
    const shopOneResponse = await fetchShopOneProducts();
    const shopTwoResponse = await fetchShopTwoProducts();
    const shopThreeResponse = await fetchShopThreeProducts();
    const shopFourResponse = await fetchShopFourProducts();

    // computerTeam
    const shopThirteenResponse = await fetchShopThirteenProducts();

    // gaming team

    // mobile team
    // Combine all products into a single array
    const allProducts = [
      ...shopOneResponse,
      ...shopTwoResponse,
      ...shopThreeResponse,
      ...shopFourResponse,
      ...shopThirteenResponse,
    ];

    // Update the state with the combined products
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
