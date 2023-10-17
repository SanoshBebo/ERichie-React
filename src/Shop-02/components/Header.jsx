import React from 'react';

import './Header.css';

import { Link,useNavigate} from 'react-router-dom';

import { ShoppingCart } from 'phosphor-react';

 

const Header = ({ onSearchChange ,disabled}) => {

  const handleSearchChange = (event) => {

    const searchQuery = event.target.value;

    onSearchChange(searchQuery);

  };

 

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

        </Link>

        <Link to='/computer' className='links'>ComputerHome</Link>

        <button className='buttonheader'onClick={handleSignOut}>Signout</button>

 

 

      </header>

    </section>

  );

};

 

export default Header;