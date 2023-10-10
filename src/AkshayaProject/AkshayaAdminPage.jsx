import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './ProductList';
import ProductForm from './ProductForm';


export const AkshayaAdminPage = () => {
    return (
        <div className='adminbutton'>
        <button>
          <Link to="/shop02/admin/productlist">View Products</Link>
        </button>
        <button>
          <Link to="/shop02/admin/add-product">Add Product</Link>
        </button>
    
        <Routes>
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/add-product" element={<ProductForm />} />
        </Routes>
      </div>
      )
}