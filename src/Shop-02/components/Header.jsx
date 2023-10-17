import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'phosphor-react';
import { useSelector } from 'react-redux';
import FetchItemsInCart from '../../ERichie/components/FetchItemsInCart';

const Header = ({ onSearchChange }) => {
  const handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    onSearchChange(searchQuery);
  };

  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)
  const items = FetchItemsInCart();

  return (
    <section >
      <header className="shop15fixedheader">
        <Link to="/homepage">
          <div className="shop15homelist">Home</div>
        </Link>
        <div className="shop15search">
          <input
            type="text"
            placeholder="Search Products"
            onChange={handleSearchChange}
          />
        </div>
        <Link to="/products">
          <div className="shop15productlist">Shop</div>
        </Link>
        <Link to="/erichie/cart">
          <ShoppingCart size={32} />
          <p className="bg-white text-black rounded-full h-6 w-6 text-center ">
                  {itemsInCart}
                </p>
        </Link>
        <Link to='/homepage'><div>Contact-Us</div></Link>
        <li><Link to='/computer' className='link'>ComputerHome</Link></li>


      </header>
    </section>
  );
};

export default Header;
