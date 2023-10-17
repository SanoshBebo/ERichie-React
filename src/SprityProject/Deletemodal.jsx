import React from "react";

function DeleteProductModal(props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-50 w-96 p-4 bg-white rounded-lg shadow-lg">
        <p>Are you sure you want to delete this product?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={props.onCancel}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={props.onConfirm}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div> 
  );
} 

export default DeleteProductModal;
