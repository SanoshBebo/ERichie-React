import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export const AkshayaAdminPage = () => {
  return (
    <div className="adminbutton">
      <button>
        <Link to="/admin">View Products</Link>
      </button>

      <button>
        <Link to="/admin/add-product">Add Product</Link>
      </button>

      <button>
        <Link to="/admin/report">Report </Link>{" "}
      </button>

      <Routes>
        <Route path="/" element={<ProductList />} />

        <Route path="/add-product" element={<ProductForm />} />
      </Routes>
    </div>
  );
};
