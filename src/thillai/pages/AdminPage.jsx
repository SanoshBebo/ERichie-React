import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { setUser } from "../../SanoshProject/redux/shopOneUserSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminPage = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [zeroStockProducts, setZeroStockProducts] = useState([]);
  const user = useSelector((state) => state.shoponeuser.user);
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const apiUrl =
    "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products";

  useEffect(() => {
    // Fetch the product data from your Firestore database

    fetch(apiUrl)
      .then((response) => response.json())

      .then((data) => {
        const products = data.documents.map((doc) => ({
          id: doc.name.split("/").pop(),

          fields: doc.fields,
        }));

        // Filter products with zero stock

        const zeroStock = products.filter(
          (product) => product.fields.stock.integerValue == 0
        );

        setZeroStockProducts(zeroStock);
      })

      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      // Use Firebase's signOut method or any other logic for logout

      navigate("admin/login");
    } catch (error) {
      // Handle error

      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => { 
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "thillaiadmin@gmail.com") {
      if (userData.role == "admin") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

  return (
    <div
      className="container-fluid mt-3 border rounded shadow"
      style={{ maxWidth: "90vw", margin: "auto", padding: 0 }}
    >
      <div className="row">
        <div className="d-flex justify-between justify-content-sm-end align-items-center bg-dark bg-gradient text-white rounded-top px-2 py-2 ms-sm-auto w-100">
          <span className="sm:hidden">Admin</span>

          <span className="hidden sm:block me-auto text-4xl">Admin Panel</span>

          <div>
            <Button
              variant="outline-primary"
              size="sm"
              active={location.pathname === "/shop07/admin-page"}
              className="mx-0"
            >
              <NavLink
                to="/shop07/admin-page"
                className="text-decoration-none text-light"
              >
                Sales
              </NavLink>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              active={location.pathname === "/shop07/admin-page/overall-report"}
              className="mx-0"
            >
              <NavLink
                to="/shop07/admin-page/overall-report"
                className="text-decoration-none text-light"
              >
                Overall Sales
              </NavLink>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              active={location.pathname === "/shop07/admin-page/products"}
              className="mx-0"
            >
              <NavLink
                to="/shop07/admin-page/products"
                className="text-decoration-none text-light"
              >
                My Products
              </NavLink>
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              className="mx-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col px-1 py-2">
          <div className="col px-1 py-2 text-center">
            <h1 className="font-bold">Products with Zero Stock</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {zeroStockProducts.map((product) => (
              <div key={product.id} className="border rounded shadow p-4">
                <img
                  src={product.fields.imageurl.stringValue}
                  alt={product.fields.productname.stringValue}
                  className="w-full h-auto"
                />

                <p className="font-semibold">Product Name:</p>

                <p>{product.fields.productname.stringValue}</p>

                <p className="font-semibold">Description:</p>

                <p>{product.fields.description.stringValue}</p>

                <p className="font-semibold">Price:</p>

                <p>{product.fields.price.integerValue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
