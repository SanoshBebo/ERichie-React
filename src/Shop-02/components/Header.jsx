import React from 'react';

import './Header.css';

import { Link,useNavigate} from 'react-router-dom';

import { ShoppingCart } from 'phosphor-react';
import { useSelector } from 'react-redux';
import FetchItemsInCart from '../../ERichie/components/FetchItemsInCart';

 

const Header = ({ onSearchChange ,disabled}) => {

  const handleSearchChange = (event) => {

    const searchQuery = event.target.value;

    onSearchChange(searchQuery);

  };
  const itemsInCart = useSelector((state)=>state.shoponecart.itemsInCart)
  const  items = FetchItemsInCart();


 

  const navigate = useNavigate();

  const handleSignOut = () => {

    localStorage.removeItem("user");

    navigate("/customer/login");

  };

 

 

  return (

    <section className='shop15fixedheaders'>

      <header className="shop15fixedheader">

      <Link to='/erichie'><div>E-Richie</div></Link>

 

        <Link to="/homepage">

          <div className="shop15homelist">Home</div>

        </Link>

     

        <div className="search">

                <input

                    type="text"

                    placeholder="Search"

                    onChange={handleSearchChange }

                    disabled={disabled}

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

        <Link to='/computer' className='links'>ComputerHome</Link>

        <button className='buttonheader'onClick={handleSignOut}>Signout</button>

 

 

      </header>

    </section>

  );

};

 

export default Header;