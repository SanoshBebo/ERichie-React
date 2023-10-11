import { fetchShopFourProducts } from "./fetchShopFourProducts";
import { fetchShopOneProducts } from "./fetchShopOneProducts";
import { fetchShopThreeProducts } from "./fetchShopThreeProducts";
import { fetchShopTwoProducts } from "./fetchShopTwoProducts";

export const fetchAllProducts = async () => {
  try {
    // Make API calls to fetch products from different endpoints
    const shopOneResponse = await fetchShopOneProducts();
    const shopTwoResponse = await fetchShopTwoProducts();
    const shopThreeResponse = await fetchShopThreeProducts();
    const shopFourResponse = await fetchShopFourProducts();
    // Combine all products into a single array
    const allProducts = [
      ...shopOneResponse,
      ...shopTwoResponse,
      ...shopThreeResponse,
      ...shopFourResponse,
    ];

    // Update the state with the combined products
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
