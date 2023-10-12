import React, { useState } from 'react';
import DeleteProducts from '../operatorCrud/DeleteProducts'
import OperatorAdding from '../operatorCrud/OperatorAdding';
import UpdateProducts from '../operatorCrud/UpdateProducts';
import ViewProducts from '../operatorCrud/ViewProducts';
import { Link } from "react-router-dom";
const AdminPage = () => {
    const [selectedOperation, setSelectedOperation] = useState(null);

    const renderSelectedOperation = () => {

        switch (selectedOperation) {
            case 'view':
                return <ViewProducts />;
            case 'add':
                return <OperatorAdding />;
            case 'delete':
                return <DeleteProducts />;
            case 'update':
                return <UpdateProducts />;
            default:
                return <div className='text-center font-bold mt-4'>Select an operation to perform.</div>;
        }
    };

    return (
        <div className="bg-cover bg-fixed h-screen">
            <div className='container mx-auto py-20 text-black'>
                <a href="#" className="text-4xl font-bold text-primary">E-<span className="text-primary">Mobile</span></a>

                <h1 className="text-3xl font-semibold text-center mb-8">Admin Page</h1>
                <div className='flex justify-center mb-8'>
                    <button onClick={() => setSelectedOperation('view')} className="btn-primary mx-2">View Products</button>
                    <button onClick={() => setSelectedOperation('delete')} className="btn-primary mx-2">Delete Products</button>
                    <button onClick={() => setSelectedOperation('add')} className="btn-primary mx-2">Add Products</button>
                    <button onClick={() => setSelectedOperation('update')} className="btn-primary mx-2">Update Products</button>
                </div>
                <div>
                    {renderSelectedOperation()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
