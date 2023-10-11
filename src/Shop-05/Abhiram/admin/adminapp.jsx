import React, { useState,useEffect } from 'react';
import Nav from './components/nav'
import {BrowserRouter} from 'react-router-dom'
import Footer from './components/footer';
import fetchItems from './components/fetcher';

const AdminApp =() =>{

  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const itemList = await fetchItems();
      setItems(itemList);
    };

    fetchData();
  }, []);

    return (
        <>
          {/* <BrowserRouter> */}
          <Nav items={items}/>
          {/* <Footer />
          </BrowserRouter> */}
    
        </>
    
      )
    }
    
    export default AdminApp;