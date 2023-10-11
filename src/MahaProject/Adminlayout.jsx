import React, { useState } from 'react';
import AdminDashboard from './components/Adminpanel';
import CustomerApp from './components/CustomerApp';

const AdminLayout = () => {
  const [view, setView] = useState('admin'); // 'admin' or 'customer'

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-purple-600">Welcome to MobileWorld</h1>
          <h1 className="text-xl font-semibold text-gray-600">Admin Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto mt-6">
        {view === 'admin' ? <AdminDashboard /> : <CustomerApp />}
      </main>
    </div>
  );
};

export default AdminLayout;
