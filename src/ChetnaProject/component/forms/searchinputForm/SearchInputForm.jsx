import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchInputForm = ({ products, darkTheme }) => {
  const [searchField, setSearchField] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchField(e.target.value);
  }

  const redirectToSearch = () => {
    const searchTerm = searchField.toLowerCase();
    const searchResults = products.filter(product =>
      product.productname.toLowerCase().includes(searchTerm)
    );

    if (searchResults.length > 0) {
      navigate('/shop11/search', { state: searchResults });
    } else {
      // Navigate to a "Not Found" page or show a "Not Found" message
      navigate('/shop11/not-found');
    }
  }

  return (
    <div className={`flex items-center justify-center mt-5`}>
      <div className={`bg-white rounded-lg shadow-md p-4 ${darkTheme ? 'shadow-dark' : 'shadow-light'}`}>
        <input
          type="text"
          className='border rounded-l-md p-2 w-full'
          placeholder="Search Mobiles"
          value={searchField}
          onChange={handleChange}
        />
        <button onClick={redirectToSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-md">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchInputForm;
