import React from "react";
import TrandingPages from './TrandingPages'
import { Link } from "react-router-dom";

const ProductListing = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="container mx-auto p-8">
            <Link to="/">
                <button>Back to Home</button>
                </Link>
                <h2 className="text-center text-2xl font-semibold mb-4">Here are the <span className="text-primary">Mobiles</span> you might like</h2>
                <div className="flex justify-center">
                    <TrandingPages />
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
