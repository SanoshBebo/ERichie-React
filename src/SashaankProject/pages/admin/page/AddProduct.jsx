//Add Product window
import React, { useContext, useState } from "react";
import MyShankContext from "../../../../SuryaProject/context/data/MyShankContext";

function AddProduct() {
    const context = useContext(MyShankContext);
    const { products, setProducts, addProduct } = context;

    // Define errors state
    const [errors, setErrors] = useState({
        price: "",
        stock: "",
    });

    // Function to handle validation and update errors
    const handleValidation = () => {
        let isValid = true;
        const newErrors = { price: "", stock: "" };

        // Validation logic for price
        const priceValue = parseFloat(products.price);
        if (isNaN(priceValue) || priceValue < 0) {
            newErrors.price = "Price must be a non-negative number.";
            isValid = false;
        }

        // Validation logic for stock
        const stockValue = parseInt(products.stock, 10);
        if (isNaN(stockValue) || stockValue < 0) {
            newErrors.stock = "Stock must be a non-negative number.";
            isValid = false;
        }

        // Update errors state
        setErrors(newErrors);

        return isValid;
    };

    // Function to handle adding a product
    const handleAddProduct = () => {
        if (handleValidation()) {
            // Proceed with adding the product
            addProduct();
        }
    };

    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
                <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                    <div className="">
                        <h1 className='text-center text-white text-xl mb-4 font-bold'>Add Product</h1>
                    </div>
                    <div>
                        <input type="text"
                            value={products.productname}
                            onChange={(e) => setProducts({ ...products, productname: e.target.value })}
                            name='title'
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product title'
                        />
                    </div>
                    <div>
                <input
                    type="number"
                    value={products.price}
                    onChange={(e) => setProducts({ ...products, price: e.target.value })}
                    name='price'
                    className={`bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none ${
                        errors.price ? "border-red-500" : ""
                    }`}
                    placeholder='Product price'
                />
                {errors.price && (
                    <p className="text-red-500">{errors.price}</p>
                )}
            </div>
                    <div>
                        <input type="text"
                            value={products.imageUrl}
                            onChange={(e) => setProducts({ ...products, imageUrl: e.target.value })}
                            name='imageurl'
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product imageUrl'
                        />
                    </div>
                    <div>
                        <input type="text"
                            value={products.category}
                            onChange={(e) => setProducts({ ...products, category: e.target.value })}
                            name='category'
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product category'
                            disabled
                        />
                    </div>
                    <div>
                <input
                    type="number"
                    value={products.stock}
                    onChange={(e) => setProducts({ ...products, stock: e.target.value })}
                    name='stock'
                    className={`bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none ${
                        errors.stock ? "border-red-500" : ""
                    }`}
                    placeholder='Stock'
                />
                {errors.stock && (
                    <p className="text-red-500">{errors.stock}</p>
                )}
            </div>
                    <div>
                        <textarea cols="30" rows="10" name='title'
                            value={products.description}
                            onChange={(e) => setProducts({ ...products, description: e.target.value })}
                            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product desc'>

                        </textarea>
                    </div>
                    <div className=' flex justify-center mb-3'>
                        <button
                            onClick={handleAddProduct}
                            className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                            Add Product
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddProduct;
