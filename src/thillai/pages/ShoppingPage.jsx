import React, { Component } from "react";

import Carousel from "react-bootstrap/Carousel";

import axios from "axios";

import ProductImg from "../components/shared/ProductImg";

import { Link } from "react-router-dom";

import NavBar from "./Navbar"; // Import your NavBar component

import "./ShoppingPage.css";

class ShoppingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProductModal: false,

      selectedProduct: null,

      selectedCategory: "All",

      products: [],

      cartCount: 0,

      quantity: 0,

      totalPrice: 0,

      showSuccessModal: false,

      currentPage: 1,

      itemsPerPage: 8,

      banners: [
        { gameName: "Game 1", imageUrl: "assassinscreed.PNG" },

        { gameName: "Game 2", imageUrl: "lordsfallen.PNG" },

        { gameName: "Game 3", imageUrl: "ghostrunner.PNG" },
      ],

      currentBannerIndex: 0, // Initialize currentBannerIndex

      searchInput: "",

      productRatings: {},

      // Add sorting options

      sortByStock: "asc", // "asc" for ascending, "desc" for descending

      sortByPrice: "asc", // "asc" for ascending, "desc" for descending
    };
  }

  handleSortByStock = () => {
    const { sortByStock } = this.state;

    const sortedProducts = [...this.state.products];

    if (sortByStock === "asc") {
      sortedProducts.sort(
        (a, b) => (a.stock?.integerValue || 0) - (b.stock?.integerValue || 0)
      );
    } else {
      sortedProducts.sort(
        (a, b) => (b.stock?.integerValue || 0) - (a.stock?.integerValue || 0)
      );
    }

    this.setState({
      products: sortedProducts,

      sortByStock: sortByStock === "asc" ? "desc" : "asc",
    });
  };

  // Function to handle sorting by price

  handleSortByPrice = () => {
    const { sortByPrice } = this.state;

    const sortedProducts = [...this.state.products];

    if (sortByPrice === "asc") {
      sortedProducts.sort(
        (a, b) => (a.price?.integerValue || 0) - (b.price?.integerValue || 0)
      );
    } else {
      sortedProducts.sort(
        (a, b) => (b.price?.integerValue || 0) - (a.price?.integerValue || 0)
      );
    }

    this.setState({
      products: sortedProducts,

      sortByPrice: sortByPrice === "asc" ? "desc" : "asc",
    });
  };

  openProductModal = (product) => {
    if (product.stock?.integerValue === 0) {
      // If stock is 0, do nothing

      return;
    }

    const initialQuantity = 0;

    const initialTotalPrice =
      (product.price?.integerValue || 0) * initialQuantity;

    this.setState({
      selectedProduct: product,

      showProductModal: true,

      quantity: initialQuantity,

      totalPrice: initialTotalPrice,
    });
  };

  handleFilter() {
    let filteredProducts = [];

    if (this.state.selectedCategory !== "All") {
      filteredProducts = [
        ...this.state.products.filter(
          (product) =>
            product.category?.stringValue === this.state.selectedCategory
        ),
      ];
    } else {
      filteredProducts = [...this.state.products];
    }

    return filteredProducts;
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        "https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products"
      );

      const products = response.data.documents.map((doc) => ({
        id: doc.name.split("/").pop(),

        ...doc.fields,
      }));

      console.log(products);

      this.setState({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    // Initialize the banner transition

    this.bannerTransitionInterval = setInterval(this.transitionBanner, 5000);
  }

  componentWillUnmount() {
    // Clear the banner transition interval to avoid memory leaks

    clearInterval(this.bannerTransitionInterval);
  }

  // Function to transition to the next banner

  transitionBanner = () => {
    this.setState((prevState) => ({
      currentBannerIndex:
        (prevState.currentBannerIndex + 1) % prevState.banners.length,
    }));
  };

  handlePagination = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const {
      currentPage,

      itemsPerPage,

      banners,

      currentBannerIndex,
    } = this.state;

    const indexOfLastItem = currentPage * itemsPerPage;

    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts = this.handleFilter();

    const currentProducts = filteredProducts.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    const pageNumbers = [];

    for (
      let i = 1;
      i <= Math.ceil(filteredProducts.length / itemsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    return (
      <div className="shopping-page-t bg-gray-100 p-5">
        <NavBar />

        <div className="banners-container-t">
          <Carousel
            interval={5000}
            controls={false}
            activeIndex={currentBannerIndex}
          >
            {banners.map((banner, index) => (
              <Carousel.Item key={index}>
                <img
                  className="w-full"
                  src={banner.imageUrl}
                  alt={banner.gameName}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="sort-buttons flex justify-center space-x-2 my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={this.handleSortByStock}
          >
            Sort by Stock {this.state.sortByStock === "asc" ? "↑" : "↓"}
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={this.handleSortByPrice}
          >
            Sort by Price {this.state.sortByPrice === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="products-container-t">
          <div className="product-list-t flex flex-wrap justify-center gap-8">
            {currentProducts.map((product, index) => {
              if (product) {
                const category = product.category?.stringValue;

                const description =
                  product.description?.stringValue ||
                  product.descriprion?.stringValue;

                const imageUrl = product.imageurl?.stringValue;

                const price = product.price?.integerValue;

                const productName = product.productname?.stringValue;

                const stock = product.stock?.integerValue;

                const stockMessage =
                  stock === 0
                    ? "Out of stock"
                    : stock < 5
                    ? `Less than 5 left (${stock} remaining)`
                    : "";

                const productURL = `/shop07/product/${product.id}`;

                return stock === 0 ? null : (
                  <Link to={productURL} key={index}>
                    <div className="product-card-t bg-gray-200 border p-4 rounded w-64 shadow-md cursor-pointer transition-transform transform hover:-translate-y-1">
                      <ProductImg
                        src={imageUrl}
                        alt="Product"
                        onClick={() => this.openProductModal(product)}
                      />

                      <p className="product-name-t text-xl">{productName}</p>

                      <p className="product-description-t">{description}</p>

                      <p className="product-price-t text-xl font-semibold">
                        Price: Rs.{price}
                      </p>

                      {stockMessage && (
                        <p className="product-stock-message-t text-red-500 font-bold">
                          {stockMessage}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>

        <div className="pagination-t flex justify-center mt-5">
          {pageNumbers.map((number) => (
            <span
              key={number}
              onClick={() => this.handlePagination(number)}
              className={`px-3 py-2 cursor-pointer ${
                number === currentPage ? "bg-blue-500 text-white" : ""
              }`}
            >
              {number}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default ShoppingPage;
