import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import ProductImg from '../components/shared/ProductImg';
import './ShoppingPage.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link, useHistory } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const history = useHistory();
class ShoppingPage extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      showProductModal: false,
      selectedProduct: null,
      selectedCategory: 'All',
      products: [], // Initialize products as an empty array
      cartCount: 0, // Initialize cart count
      quantity: 1, // Initialize quantity to 1
      totalPrice: 0, // Initialize total price to 0
      showSuccessModal: false,
    };
  }

  categories = ['All', 'Electronics'];

  handleCloseProductModal = () => this.setState({ showProductModal: false });
  
  openProductPage = (product) => (
    <Link
      to={{
        pathname: `/shop07/product/${product.id}`,
        state: { product },
      }}
    >
      <button className="btn btn-buy-now">Buy Now</button>
    </Link>
  );
  showSuccessModal = () => {
    this.setState({ showSuccessModal: true });
  };
  openProductModal = (product) => {
    const initialQuantity = 1; // Initial quantity is 1
    const initialTotalPrice = (product.price?.integerValue || 0) * initialQuantity; // Calculate initial total price
  
    this.setState({
      selectedProduct: product,
      showProductModal: true,
      quantity: initialQuantity, // Set quantity to 1 initially
      totalPrice: initialTotalPrice, // Set initial total price
    });
  };
  

  openQuantityInputModal = () => {
    const { selectedProduct, quantity } = this.state;

    const newQuantity = window.prompt('Enter quantity:', this.state.quantity);
    if (newQuantity !== null) {
      const parsedQuantity = parseInt(newQuantity, 10);

      if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
        // Calculate the new total price
        const newTotalPrice = selectedProduct.price?.integerValue * parsedQuantity;

        this.setState({
          quantity: parsedQuantity,
          totalPrice: newTotalPrice,
        });
      } else {
        alert('Invalid quantity. Please enter a valid quantity.');
      }
    }
  };

  handlePurchase = async () => {
    const { selectedProduct, quantity, totalPrice } = this.state;
  
    if (!selectedProduct) {
      console.error('No product selected for purchase.');
      return;
    }
  
    // Fetch the existing product data
    try {
      const response = await axios.get(`https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products/${selectedProduct.id}`);
      const existingProductData = response.data.fields;
  
      // Calculate the updated stock quantity
      const updatedQuantity = selectedProduct.stock?.integerValue - quantity;
  
      if (updatedQuantity < 0) {
        console.error('Invalid quantity. Product quantity cannot be negative.');
        return;
      }
  
      // Create an object with the updated data including existing fields
      const updatedData = {
        ...existingProductData,
        stock: { integerValue: updatedQuantity },
      };
  
      // Make a PATCH request to update the product document
      await axios.patch(`https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products/${selectedProduct.id}`, {
        fields: updatedData,
      });
  
      // Make a POST request to Firestore to create a new order
      await axios.post('https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Orders', {
        fields: {
          Date: { stringValue: new Date().toISOString() },
          ProductID: { stringValue: selectedProduct.id },
          Quantity: { integerValue: quantity },
          ShopID: { stringValue: 'shop07' },
          TotalPrice: { doubleValue: totalPrice },
          UserID: { stringValue: 'yourUserID' },
        },
      });
  
      // If the requests succeed, you can reset the selectedProduct, quantity, and totalPrice
      this.setState({
        selectedProduct: null,
        quantity: 1,
        totalPrice: 0,
        showSuccessModal: true, // Show the success modal
      });
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };
  
  handleFilter() {
    let filteredProducts = [];
    if (this.state.selectedCategory !== 'All') {
      filteredProducts = [...this.state.products.filter((product) => product.category?.stringValue === this.state.selectedCategory)];
    } else {
      filteredProducts = [...this.state.products];
    }

    return filteredProducts;
  }

  async componentDidMount() {
    try {
      // Fetch products from Firestore using Axios
      const response = await axios.get('https://firestore.googleapis.com/v1/projects/myapp-5dc30/databases/(default)/documents/Products');

      // Extract the data field from the Firestore response
      const products = response.data.documents.map((doc) => ({ id: doc.name.split('/').pop(), ...doc.fields }));
      console.log(products);
      this.setState({ products });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  render() {
    const filteredProducts = this.handleFilter();

    return (
      <div>
         
         <div className="navbar">
      <Link to="/gaming">Gaming</Link>
      <Link to="/erichie">HomePage</Link>
      <div className="cart-icon" onClick={() => history.push('/cart')}>
        <FaShoppingCart />
      </div>
    </div>


        <div className='container d-flex justify-content-between border rounded p-2 shadow-sm align-items-center'>
          <small className='text-muted d-none d-md-block'></small>
          <div className='d-flex justify-content-between'>
            <Dropdown onSelect={(value) => this.setState({ selectedCategory: value })} className='mx-1'>
              <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
                {this.state.selectedCategory}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {this.categories.map((category) => (
                  <Dropdown.Item key={category} eventKey={category}>
                    {category}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        {this.state.showProductModal && this.state.selectedProduct && (
          <div className='modal fade show' style={{ display: 'block' }}>
            <div className='modal-dialog modal-dialog-centered modal-lg'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>{this.state.selectedProduct.productname?.stringValue}</h5>
                  <button type='button' className='btn-close' aria-label='Close' onClick={this.handleCloseProductModal}></button>
                </div>
                <div className='modal-body'>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <ProductImg src={this.state.selectedProduct.imageurl?.stringValue} alt='Product' className='img-fluid' />
                      </div>
                      <div className='col-md-6'>
                        <p>Description: {this.state.selectedProduct.description?.stringValue}</p>
                        <p>Price: ₺{this.state.selectedProduct.price?.integerValue}</p>
                        <p>Quantity: {this.state.quantity}</p>
                        <p>Total Price: ₺{this.state.totalPrice}</p>
                        <button className='btn btn-primary' onClick={this.openQuantityInputModal}>
                          Change Quantity
                        </button>
                        <button className='btn btn-success' onClick={this.handlePurchase}>
                          Purchase
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='container border rounded mt-2 px-0 px-sm-2 shadow-sm'>
          <div className='product-list'>
            {filteredProducts.map((product, index) => {
              if (product) {
                const category = product.category?.stringValue;
                const description = product.description?.stringValue || product.descriprion?.stringValue; // Handle the typo
                const imageUrl = product.imageurl?.stringValue;
                const price = product.price?.integerValue;
                const productName = product.productname?.stringValue;
                const stock = product.stock?.integerValue;

                return (
                  <div className='product-card' key={index}>
                    <ProductImg src={imageUrl} alt='Product' />
                    <p className='product-name'>{productName}</p>
                    <p className='product-description'>{description}</p>
                    <p className='product-price'>Price: ₺{price}</p>
                    
                    
                    {this.openProductPage(product)}
                  </div>
                );
              } else {
                return null; // Skip rendering if product is undefined
              }
            })}
          </div>
        </div>
        <Modal show={this.state.showSuccessModal} onHide={() => this.setState({ showSuccessModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Order Placed Successfully</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your order has been successfully placed!</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => this.setState({ showSuccessModal: false })}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ShoppingPage;