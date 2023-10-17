import React from "react";

import TrandingPages from './TrandingPages'

import { Link } from "react-router-dom";

 

const ProductListing = () => {

    return (

        <div className="bg-gray-100 min-h-screen flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>

            <div className="container mx-auto p-8">

                <div className="flex justify-center">

                    <TrandingPages />

                </div>

            </div>

        </div>

    );

};

 

export default ProductListing;