const Cart = ({ cart }) => {
    return (
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((product) => (
            <li key={product.id}>
              {product.productname} - Price: ${product.price}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  