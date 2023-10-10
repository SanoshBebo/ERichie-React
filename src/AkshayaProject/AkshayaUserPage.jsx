import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserView from "./UserView";



export const AkshayaUserPage = () => (
    <div>
      <Routes>
        <Route path="/" element={<UserView />} />
      </Routes>
    </div>
  );