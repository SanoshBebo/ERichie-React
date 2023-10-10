import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const SearchInput = ({ products, onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Fetch product names from Firestore
    async function fetchProductNames() {
      try {
        const baseUrl =
          'https://firestore.googleapis.com/v1/projects/about-me-bf7ef/databases/(default)/documents';
        const collectionName = 'Products';
        const apiUrl = `${baseUrl}/${collectionName}`;

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data.documents) {
          const productDocuments = response.data.documents;
          const productNames = productDocuments.map((document) =>
            document.fields.productname.stringValue
          );

          setOptions(productNames);
        }
      } catch (error) {
        console.error('Error fetching product names:', error);
      }
    }

    fetchProductNames();
  }, []);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={options}
        value={searchTerm}
        onInputChange={(event, newValue) => {
          setSearchTerm(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a product"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
        onChange={(event, newValue) => {
          setSearchTerm(newValue);
          // Pass the selected product name back to the parent component
          onSelectProduct(newValue);
        }}
      />
    </Stack>
  );
};

export default SearchInput;
