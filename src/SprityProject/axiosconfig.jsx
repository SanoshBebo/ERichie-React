// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 
  'https://firestore.googleapis.com/v1/projects/lemontech-67162/databases/(default)/documents/Productid'
});

export default instance;
