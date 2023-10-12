import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import ProductList from './ProductList';
import Header from './Header'; // Import the Header component
import CheckoutPage from './CheckOut';

const UserOperations = () => {
    // Define state to store the search input value
    const [setSearchInput] = useState('');

    // Define the handleSearchChange function to update the search input value
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <div>
            <Header/>
            <Routes>
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/checkout/:productId" element={<CheckoutPage />} />
            </Routes>

        </div>
    );
};

export default UserOperations;
