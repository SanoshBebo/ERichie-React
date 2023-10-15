import React from 'react'
import Button from 'react-bootstrap/Button';


import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import auth from '../app/store/auth';

const AdminPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const handleLogout = async () => {
        try {
         // Use Firebase's signOut method
          navigate('/'); 
        } catch (error) {
          // Handle error
          console.error('Logout failed:', error);
        }
      };

    return (
        
        <div className='container mt-3 border rounded shadow' style={{ maxWidth: '960px', margin: "auto" }}>

            <div className='row'>
                <div className='d-flex justify-content-between justify-content-sm-end align-items-center bg-dark bg-gradient text-white rounded-top px-2 py-2 ms-sm-auto'>

                    <span className='d-sm-none'>Admin</span>
                    <span className='d-none d-sm-block me-auto fs-4'>Admin Panel</span>
                    <div>
                    

                        <Button variant="outline-primary" size="sm" active={location.pathname === "/shop07/admin-page"} className="mx-0">
                            <NavLink to="/shop07/admin-page" className={"text-decoration-none text-light"}>Sales</NavLink>
                        </Button>
                        <Button variant="outline-primary" size="sm" active={location.pathname === "/shop07/admin-page/overall-report"} className="mx-0">
                            <NavLink to="/shop07/admin-page/overall-report" className={"text-decoration-none text-light"}> Overall Sales</NavLink>
                        </Button>

                        <Button variant="outline-primary" size="sm" active={location.pathname === "/shop07/admin-page/products"} className="mx-0">
                            <NavLink to="/shop07/admin-page/products" className={"text-decoration-none text-light"}>Products</NavLink>
                        </Button>
                        <Button
        variant="outline-danger" // You can choose an appropriate variant for logout
        size="sm"
        className="mx-2" // Add margin to separate it from the "Sales" button
        onClick={handleLogout}
      >
        Logout
      </Button>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col px-1 py-2'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminPage