import React, { useState } from "react";

import DeleteProducts from "../operatorCrud/DeleteProducts";

import OperatorAdding from "../operatorCrud/OperatorAdding";

import UpdateProducts from "../operatorCrud/UpdateProducts";

import ViewProducts from "../operatorCrud/ViewProducts";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../../../SanoshProject/redux/shopOneUserSlice";

const AdminPage = () => {
  const user = useSelector((state) => state.shoponeuser.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  useEffect(() => {
    if (!isLoadingUser && user.length === 0) {
      navigate("/admin/login");
    }
  }, [isLoadingUser, user, navigate]);

  useEffect(() => { 
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email == "chetnaadmin@gmail.com") {
      if (userData.role == "customer") {
        navigate("/admin/login");
      }
      dispatch(setUser(userData));
    }
    setIsLoadingUser(false);
  }, []);

  const [selectedOperation, setSelectedOperation] = useState(null);

  const buttonStyle = {
    backgroundColor: "#007bff",

    color: "white",

    border: "none",

    padding: "20px",

    margin: "0 5px",

    borderRadius: "5px",

    cursor: "pointer",

    transition: "background-color 0.3s",
  };

  const renderSelectedOperation = () => {
    switch (selectedOperation) {
      case "view":
        return <ViewProducts />;

      case "add":
        return <OperatorAdding />;

      case "delete":
        return <DeleteProducts />;

      case "update":
        return <UpdateProducts />;

      default:
        return (
          <div style={{ textAlign: "center", fontWeight: "800" }}>
            Select an operation to perform.
          </div>
        );
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",

        padding: "20px",

        border: "1px solid #ccc",

        // borderRadius: "10px",

        // backgroundColor: "#f9f9f9",

        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

        backgroundColor: "rgba(0, 0, 0, 0.5)",

        // backgroundImage:
        //   'url("../../pictures/pexels-mudassir-ali-2680270.jpg")',

        backgroundPosition: "fixed",

        // padding: "20px",

        color: "black",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: "white", fontSize: "1.5rem", fontWeight: "800" }}>
          E-<span style={{ color: "#007bff" }}>Mobile</span>
        </div>
      </div>

      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "white",
          fontWeight: "800",
          fontSize: "1.5rem",
        }}
      >
        Admin Page
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <button
          style={buttonStyle}
          onClick={() => setSelectedOperation("view")}
        >
          View Products
        </button>

        <button
          style={buttonStyle}
          onClick={() => setSelectedOperation("delete")}
        >
          Delete Products
        </button>

        <button style={buttonStyle} onClick={() => setSelectedOperation("add")}>
          Add Products
        </button>

        <button
          style={buttonStyle}
          onClick={() => setSelectedOperation("update")}
        >
          Update Products
        </button>

        <Link to="/shop11/admin/shop-report">
          <button
            style={buttonStyle}
            onClick={() => setSelectedOperation("Report")}
          >
            Report
          </button>
          </Link>
          
        <Link to="/shop11/admin/overall-report">

          <button

            style={buttonStyle}

            onClick={() => setSelectedOperation("ERichie-Report")}

          >

            ERichie-Report

          </button>

        </Link>
        <Link to="/admin/login">
          <button
            style={buttonStyle}
            onClick={() => setSelectedOperation("Report")}
          >
            Logout
          </button>
        </Link>

      </div>

      <div>{renderSelectedOperation()}</div>
    </div>
  );
};

export default AdminPage;
