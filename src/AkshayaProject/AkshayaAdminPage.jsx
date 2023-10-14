import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export const AkshayaAdminPage = () => {
  return (
    <div className="adminbutton min-h-screen">
      <div>
        <header className="bg-blue-200 py-4 text-center">
          <h1 className="text-4xl font-bold">E-NERD</h1>
        </header>

        <br />
      </div>
      <div className="flex justify-evenly items-center w-full p-20">
        <button className="p-3 bg-blue-500">
          <Link to="/shop02/admin/add-product">
            <p className="text-white">Add Product</p>
          </Link>
        </button>
        <div>
          <h1 className="font-bold text-3xl">Products</h1>
        </div>
        <button className="p-3 bg-blue-500">
          <Link to="/shop02/admin/report">
            <p className="text-white">Report</p>
          </Link>{" "}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<ProductList />} />

        
      </Routes>
    </div>
  );
};

export default AkshayaAdminPage;
