import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import ProductModal from './ProductModal';
import axios from 'axios';
import ProductImg from './../../shared/ProductImg';

class ProductList1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isUpdate: false,
      selectedProduct: null,
      selectedCategory: 'All',
      products: [], // Initialize products as an empty array
    };
  }

  categories = [
    'All',
    'Electronics',
  ];

  handleClose = () => this.setState({ show: false });

  openModal = () => {
    this.setState({ show: true, isUpdate: false });
  };

  handleUpdate = (product) => {
    if (product !== null) {
      this.setState({ selectedProduct: product });
      this.setState({ show: true, isUpdate: true });
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
      const products = response.data.documents.map((doc) => doc.fields);
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
        <div className='container d-flex justify-content-between border rounded p-2 shadow-sm align-items-center'>
          <button onClick={this.openModal} className='btn btn-dark bg-gradient'>
            Add Product
          </button>
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
        {this.state.show && (
          <ProductModal
            selectedProduct={this.state.selectedProduct}
            show={this.state.show}
            handleClose={this.handleClose}
            productList={this.state.products}
            isUpdate={this.state.isUpdate}
          />
        )}
        <div className='container border rounded mt-2 px-0 px-sm-2 shadow-sm'>
          <div className='table-responsive' style={{ maxHeight: '620px' }}>
            <div className='text-center text-muted'>
              <small className='d-md-none'>Double click product to edit its properties.</small>
            </div>
            {filteredProducts.length > 0 ? (
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col' className='px-1 px-sm-2'>
                      Image
                    </th>
                    <th scope='col' className='px-1 px-sm-2'>
                      Product
                    </th>
                    <th scope='col' className='text-center px-1 px-sm-2'>
                      Price
                    </th>
                    <th scope='col' className='text-center px-1 px-sm-2'>
                      Stock
                    </th>
                    <th scope='col' className='text-center px-1 px-sm-2'>
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product, index) => {
  if (product) {
    const category = product.category?.stringValue;
    const description = product.description?.stringValue || product.descriprion?.stringValue; // Handle the typo
    const imageUrl = product.imageurl?.stringValue;
    const price = product.price?.integerValue;
    const productName = product.productname?.stringValue;
    const stock = product.stock?.integerValue;

    return (
      <tr key={index} onDoubleClick={() => this.handleUpdate(product)}>
        <td className='px-0 px-sm-2'>
          <ProductImg
            src={imageUrl}
            className={'rounded border p-1'}
            style={{ objectFit: 'contain', width: '50px' }}
          />
        </td>
        <td className='px-0 px-sm-2'>
          <div className='d-flex flex-column small'>
            <strong>{productName}</strong>
            {description}
          </div>
        </td>
        <td className='text-center px-1 px-sm-2'>{price}</td>
        <td className='text-center px-1 px-sm-2'>{stock}</td>
        <td className='text-center px-1 px-sm-2'>
          {/* You can add your rating component here */}
        </td>
      </tr>
    );
  } else {
    return null; // Skip rendering if product is undefined
  }
})}

                </tbody>
              </table>
            ) : (
              <div className='alert alert-warning d-flex align-items-center justify-content-center h-100 m-3'>
                There is no product.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList1;
