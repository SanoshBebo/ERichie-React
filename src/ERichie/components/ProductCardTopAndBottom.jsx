import React from "react";

const ProductCardTopAndBottom = (data) => {
  const { topProducts, bottomProducts, title, bg } = data;
  console.log(topProducts, bottomProducts, title);

  const shopnames = {
    shop01: "Cosmic-Media-Gadgets",
    shop02: "E-Nerd",
    shop03: "Vishal Media Shop",
    shop04: "Supreme-Mart",
    shop05: "Dead-Eye-GameStore",
    shop06: "Lasya-Gaming",
    shop07: "Thillai-Gaming",
    shop09: "Shank-Mobiles",
    shop10: "Lemon-Tech",
    shop11: "E-Mobile",
    shop12: "Mobile-World",
    shop13: "Abhiram-Store",
    shop14: "Digital-Genie",
    shop15: "Sanjay-Computers",
    shop16: "Dhanu-Computers",
    shop17: "MrComputerWizz",
  };
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="bg-gray-200 w-full">
        <h1 className="font-bold text-2xl p-5">{title}</h1>
      </div>

      <div className="flex justify-center items-center mt-10">
        <div className="flex-row">
          <h2 className="font-bold text-xl p-3 m-2">Top Selling</h2>
          <div className="p-5 mx-20 border border-gray-200">
            <ul>
              {topProducts &&
                topProducts.map((product, index) => (
                  <li key={index} className="p-10">
                    <div className="flex items-center justify-start gap-10">
                      <div className="h-24 w-24">
                        <img
                          src={product.productInfo.imageurl}
                          alt="img"
                          className="w-full object-contain"
                        />
                      </div>
                      <div className="flex-row ">
                        <p className="p-1">{product.productInfo.productname}</p>
                        <p className="p-1">
                          {shopnames[product.productInfo.shopid]}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              {topProducts.length == 0 && <div>No Products Available</div>}
            </ul>
          </div>
        </div>
        <div className="flex-row">
          <h2 className="font-bold text-xl p-3">Bottom Selling</h2>
          <div className="p-5 mx-20 border border-gray-200">
            <ul>
              {bottomProducts &&
                bottomProducts.map((product, index) => (
                  <li key={index} className="p-10">
                    <div className="flex items-center justify-start gap-10">
                      <div className="h-24 w-24">
                        <img
                          src={product.productInfo.imageurl}
                          alt="img"
                          className="w-full object-contain"
                        />
                      </div>
                      <div className="flex-row ">
                        <p className="p-1">{product.productInfo.productname}</p>
                        <p className="p-1">
                          {shopnames[product.productInfo.shopid]}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              {bottomProducts.length == 0 && <div>No Products Available</div>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardTopAndBottom;
