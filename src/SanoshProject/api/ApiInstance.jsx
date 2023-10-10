import axios from "axios";

const apiKey = "your_api_key_here"; // Replace with your API key
const apiInstance = axios.create({
  baseURL:
    "https://firestore.googleapis.com/v1/projects/cosmicmediastore-438f7/databases/(default)/documents", // Replace with your API's base URL
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey, // Include the API key in the headers
  },
});

export default apiInstance;
