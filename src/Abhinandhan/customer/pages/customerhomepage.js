import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Navbar, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './customerhomepage.css'; // Import the CSS file

function CustomerHomePage() {
  const [gamingProducts, setGamingProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from Firestore
  useEffect(() => {
    axios
      .get(
        'https://firestore.googleapis.com/v1/projects/superstore-c138c/databases/(default)/documents/products'
      )
      .then((response) => {
        const productsData = response.data.documents.map((doc) => {
          const data = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            description: data.description?.stringValue || '',
            modelno: data.modelno?.stringValue || '',
            price: data.price?.doubleValue || 0,
            productname: data.productname?.stringValue || '',
            quantity: data.quantity?.integerValue || 0,
            imageUrl: data.imageUrl?.stringValue || '',
          };
        });
        setGamingProducts(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, []);

  // Filter products based on search query
  const filteredProducts = gamingProducts.filter((product) =>
    product.productname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Form inline className="ml-auto">
            <Form.Control
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product.id} lg={3} md={4} sm={6} xs={12}>
              <Card className="product-card">
                <div className="product-image">
                  <Card.Img src={product.imageUrl} alt={product.productname} />
                </div>
                <Card.Body>
                  <Card.Title>{product.productname}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text className="text-warning">${product.price.toFixed(2)}</Card.Text>
                  <Button variant="success" className="mr-2">
                    Buy Now
                  </Button>
                  <Button variant="primary">
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default CustomerHomePage;
