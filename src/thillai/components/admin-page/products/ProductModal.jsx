import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { addProduct, updateProduct, deleteProduct } from '../../../app/firebase';

export default class AddProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [
        'Gaming',
        
      ],
      productData: {
        brand: '',
        name: '',
        description: '',
        imgUrl: '',
        category: 'Gaming',
        stock: 0,
        price: 0,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isUpdate && prevProps.selectedProduct !== this.props.selectedProduct) {
      const selectedProduct = this.props.selectedProduct || {}; // Make sure selectedProduct is an object
      const { productData } = this.state;
      console.log(selectedProduct)
      // Check if selectedProduct has fields property (assuming it's an object)
      if (selectedProduct.fields) {
        this.setState({
          productData: {
            ...productData,
            brand: selectedProduct.fields.brand?.stringValue || '',
            name: selectedProduct.fields.productname?.stringValue || '',
            description: selectedProduct.fields.description?.stringValue || '',
            imgUrl: selectedProduct.fields.imageurl?.stringValue || '',
            category: selectedProduct.fields.category?.stringValue || 'Electronics',
            stock: parseInt(selectedProduct.fields.stock?.integerValue || 0),
            price: parseFloat(selectedProduct.fields.price?.integerValue || 0),
          },
        });
      }
    }
  }
  

  submitHandler = async (e) => {
    e.preventDefault();

    // Extract form input values
    const name = e.target.name.value;
    const description = e.target.description.value;
    const imgUrl = e.target.imgUrl.value;
    const category = e.target.category.value;
    const stock = parseInt(e.target.stock.value);
    const price = parseFloat(e.target.price.value);

    // Create a product object with the Firestore format
    const product = {
      fields: {
        category: { stringValue: category },
        description: { stringValue: description },
        imageurl: { stringValue: imgUrl },
        price: { integerValue: price.toString() },
        productname: { stringValue: name },
        shopname: { stringValue: "Shop07" }, // Modify as needed
        stock: { integerValue: stock.toString() },
      },
    };

    try {
      if (this.props.isUpdate) {
        // If it's an update, call your updateProduct function with the product object and the document ID.
        await updateProduct(product, this.props.selectedProduct?.name);
      } else {
        // If it's a new product, call your addProduct function with the product object.
        await addProduct(product);
      }
      this.props.handleClose(); // Close the modal on success
    } catch (error) {
      console.error("Error adding/updating product:", error);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  deleteHandler = async () => {
    await deleteProduct(this.props.selectedProduct?.name);
    this.props.handleClose();
  };

  render() {
    const { show, isUpdate } = this.props;
    const { productData } = this.state;

    if (!show) {
      return null;
    }

    return (
      <Modal
        show={show}
        onHide={this.props.handleClose}
        backdrop={isUpdate ? 'true' : 'static'}
        keyboard={false}
        centered
      >
        <Form onSubmit={this.submitHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Product Features</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <FloatingLabel controlId="brand" label="Brand" className="my-2">
                  <Form.Control
                    type="text"
                    placeholder="Brand"
                    name="brand"
                    required
                    value={productData.brand}
                    onChange={(e) => this.setState({ productData: { ...productData, brand: e.target.value } })}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="name" label="Name" className="my-2">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    size="sm"
                    name="name"
                    required
                    value={productData.name}
                    onChange={(e) => this.setState({ productData: { ...productData, name: e.target.value } })}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="description" label="Description" className="my-2">
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: '100px' }}
                    size="sm"
                    name="description"
                    required
                    value={productData.description}
                    onChange={(e) => this.setState({ productData: { ...productData, description: e.target.value } })}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="imgUrl" label="Image URL" className="my-2">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    size="sm"
                    name="imgUrl"
                    value={productData.imgUrl}
                    onChange={(e) => this.setState({ productData: { ...productData, imgUrl: e.target.value } })}
                  />
                </FloatingLabel>
                <div className="row">
                  <div className="col-12 col-sm-5">
                    <FloatingLabel controlId="category" label="Category">
                      <Form.Select
                        size="sm"
                        name="category"
                        value={productData.category}
                        onChange={(e) => this.setState({ productData: { ...productData, category: e.target.value } })}
                      >
                        {this.state.categories.map((category, index) => (
                          <option value={category} key={index}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  <div className="col-12 col-sm-7 d-flex my-2 my-sm-0">
                    <FloatingLabel controlId="stock" label="Stock" className="me-1">
                      <Form.Control
                        type="number"
                        placeholder="0"
                        size="sm"
                        name="stock"
                        required
                        value={productData.stock}
                        onChange={(e) => this.setState({ productData: { ...productData, stock: e.target.value } })}
                      />
                    </FloatingLabel>
                    <FloatingLabel controlId="price" label="Price" className="ms-1 w-100">
                      <Form.Control
                        type="number"
                        placeholder="0"
                        size="sm"
                        name="price"
                        required
                        value={productData.price}
                        onChange={(e) => this.setState({ productData: { ...productData, price: e.target.value } })}
                      />
                    </FloatingLabel>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            {isUpdate && (
              <Button variant="danger" onClick={this.deleteHandler}>
                Delete Product
              </Button>
            )}
            <Button variant={isUpdate ? 'warning' : 'primary'} type="submit">
              {isUpdate ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
