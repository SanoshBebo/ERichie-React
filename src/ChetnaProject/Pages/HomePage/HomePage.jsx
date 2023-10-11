import React from "react";
import Showcase from "../../component/showcase/showcase";
import ProductListing from "../../component/layout/productlisting/ProductListing";
import { ContactForm } from "../../component/Contact/Contact";

const HomePage = () => {
  return (
    <section>
      <div>
        <Showcase />
      </div>
      <div id="Mobile" className="py-10">
        <ProductListing />
      </div>
    </section>
  );
};

export default HomePage;
