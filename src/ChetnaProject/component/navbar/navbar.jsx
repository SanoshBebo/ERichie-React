import React, { useState } from "react";

 

import { useParams, Link, useNavigate } from "react-router-dom";

 

const Navbar = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

 

  const toggleModal = () => {

    setIsModalVisible(!isModalVisible);

  };

 

  const recipientEmail = "bisenchetna3@gmail.com";

 

  const subject = "Contact";

 

  const handleEmailClick = () => {

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(

      subject

    )}`;

  };

 

  return (

    <section

      style={{

        position: "fixed",

 

        width: "100%",

 

        top: 0,

 

        display: "flex",

 

        justifyContent: "space-between",

 

        alignItems: "center",

 

        padding: "1rem",

 

        background: "rgba(0, 0, 0, 5)",

 

        zIndex: 1,

      }}

    >

      <div style={{ flex: "1" }}>

        <a

          href="#"

          style={{

            fontSize: "1.5rem",

            color: "#fff",

            textDecoration: "none",

            fontFamily: "Roboto Condensed, sans-serif",

            fontWeight: "700",

          }}

        >

          E-

          <span style={{ fontFamily: "Roboto Condensed, sans-serif", color:"#007bff"}}>

            Mobile

          </span>

        </a>

      </div>

 

      <nav style={{ display: "flex", gap: "20px" }}>

        {/* <a

          href="#Mobile"

          style={{

            color: "#fff",

            textDecoration: "none",

            fontSize: "1.1rem",

            transition: "0.2s ease-in",

            cursor: "pointer",

          }}

        >

          Mobiles

        </a> */}

 

        <a

          href="#"

          style={{

            color: "#fff",

            textDecoration: "none",

            fontSize: "1.1rem",

            transition: "0.2s ease-in",

            cursor: "pointer",

            padding:"10px"

          }}

          onClick={toggleModal}

        >

          Contact

        </a>

        <Link

            to="/shop11/protectlist"

            style={{ textDecoration: "none", color: "#fff", cursor: "pointer" }}

          >

            <button

              style={{

                backgroundColor: "#007bff",

 

                color: "white",

 

                border: "none",

 

                padding: "8px",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

              }}

            >

              Mobiles

            </button>

          </Link>

 

        <div style={{ display: "flex", gap: "10px" }}>

          <Link

            to="/erichie"

            style={{ textDecoration: "none", color: "#fff", cursor: "pointer" }}

          >

            <button

              style={{

                backgroundColor: "#007bff",

 

                color: "white",

 

                border: "none",

 

                padding: "8px",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

              }}

            >

              Back to Erichie

            </button>

          </Link>

 

          <Link

            to="/mobiles"

            style={{ textDecoration: "none", color: "#fff", cursor: "pointer" }}

          >

            <button

              style={{

                backgroundColor: "#007bff",

 

                color: "white",

 

                border: "none",

 

                padding: "8px",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

              }}

            >

              Back to mobile

            </button>

          </Link>

          <Link

            to="/erichie/cart"

            style={{ textDecoration: "none", color: "#fff", cursor: "pointer" }}

          >

            <button

              style={{

                backgroundColor: "#ffff",

 

                color: "white",

 

                border: "none",

 

                padding: "8px",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

               

              }}

            >

              🛒

            </button>

          </Link>

          <Link

            to="/customer/login"

            style={{ textDecoration: "none", color: "#fff", cursor: "pointer" }}

          >

            <button

              style={{

                backgroundColor: "#007bff",

 

                color: "white",

 

                border: "none",

 

                padding: "8px",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

              }}

            >

              Log out

            </button>

          </Link>

        </div>

      </nav>

 

      {isModalVisible && (

        <div

          style={{

            display: "flex",

 

            justifyContent: "center",

 

            alignItems: "center",

 

            position: "fixed",

 

            left: 0,

 

            top: 0,

 

            width: "100%",

 

            height: "100%",

 

            backgroundColor: "rgba(0, 0, 0, 0.4)",

 

            overflow: "auto",

          }}

        >

          <div

            style={{

              backgroundColor: "#fefefe",

 

              padding: "20px",

 

              border: "1px solid #888",

 

              width: "80%",

 

              maxWidth: "400px",

 

              textAlign: "center",

 

              position: "relative",

 

              zIndex: 1,

            }}

          >

            <h2>Contact Us</h2>

 

            <button

              onClick={handleEmailClick}

              style={{

                backgroundColor: "#007bff",

 

                color: "white",

 

                border: "none",

 

                padding: "10px 20px",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

              }}

            >

              Send Email

            </button>

 

            <button

              onClick={toggleModal}

              className="close-modal"

              style={{

                marginTop: "20px",

 

                padding: "10px 20px",

 

                backgroundColor: "#ccc",

 

                border: "none",

 

                borderRadius: "5px",

 

                cursor: "pointer",

 

                transition: "background-color 0.3s ease",

              }}

            >

              Close

            </button>

          </div>

        </div>

      )}

    </section>

  );

};

 

export default Navbar;