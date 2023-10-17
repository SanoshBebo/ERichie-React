import React from "react";

 

import Navbar from "../navbar/navbar";

import HomepageImage from "./Homepageimage.jpg"

 

const Showcase = () => {

  return (

    <section

      style={{

        height: "100vh",

 

        width: "100%",

 

        backgroundImage: `url(${HomepageImage})`,

 

        backgroundColor: "rgba(0, 0, 0, 0.5)",

 

        position: "relative",

 

        display: "flex",

 

        justifyContent: "center",

 

        alignItems: "center",

      }}

      className="showcase-container"

    >

      <Navbar />

 

      <div

        style={{

          height: "100%",

 

          backgroundColor: "rgba(0, 0, 0, 0.5)",

 

          position: "absolute",

        }}

        className="overlay"

      ></div>

 

      {/* <div

        style={{

          width: "fit-content",

 

          display: "flex",

 

          flexDirection: "column",

 

          justifyContent: "center",

 

          alignItems: "center",

        }}

        className="showcase-content"

        id="showcasecolor"

      >

        <div className="mainscreen">

          <h1

            style={{

              color: "white",

 

              textAlign: "center",

 

              fontSize: "2.5rem",

            }}

          >

            Best{" "}

            <span

              style={{

                color: "#007bff",

 

                fontFamily: "Roboto Condensed",

 

                fontSize: "2.5rem",

              }}

            >

              Mobiles

            </span>{" "}

            Available

          </h1>

 

          <p

            style={{

              color: "white",

 

              fontFamily: "Roboto Condensed",

 

              fontSize: "2.5rem",

            }}

          >

            Buy quality products

          </p>

        </div>

      </div>*/}

    </section>

  );

};

 

export default Showcase;