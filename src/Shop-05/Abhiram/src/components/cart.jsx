import React, { useEffect, useState } from 'react'
import '../styles/cart.css'
import { Link, useNavigate } from 'react-router-dom'
import {AiOutlineClose} from 'react-icons/ai';
import Axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';


const Cart = ({cart, setCart}) => {
    console.log(token);
    const navigate = useNavigate();
    const [newqty, setNewqty] = useState(0);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    // const current_timestamp = Timestamp.fromDate(new Date())


    const incqty = (product)=>
    {
        const exist = cart.find((x)=>
        {
            return x.id === product.id
        })
        setCart(cart.map((curElm)=>
        {
            return curElm.id === product.id ? {...exist, quantity: exist.quantity + 1} : curElm
        }))
    }
    const decqty = (product)=>
    {
        const exist = cart.find((x)=>
        {
            return x.id === product.id
        })
        setCart(cart.map((curElm)=>
        {
            return curElm.id === product.id ? {...exist, quantity: exist.quantity - 1} : curElm
        }))
    }

    const removeproduct = (product) => 
    {
        const exist = cart.find((x) => 
        {
        return x.id === product.id
        })
        if(exist.quantity > 0)
        {
        setCart(cart.filter((curElm) => 
        {
            return curElm.id !== product.id
        }))
        }
    }

    const total = cart.reduce((price, item) => price + item.quantity * item.price, 0)

    const checkout = async () => {
        try {

            for (const curElm of cart) {
                if (curElm.quantity > curElm.stock) {
                    console.error(`Insufficient stock for product ${curElm.productname}`);
                    alert(`Insufficient stock for product ${curElm.productname}`);
                    return; // Exit checkout if the quantity is not available
                }
            }
            
            // Loop through the cart and send each item's data to Firestore
            for (const curElm of cart) {
                console.log(curElm.shopid);
                setNewqty(curElm.quantity * curElm.price);
                const headers = {
                    'Authorization': `Bearer ${token}`
                    // 'Content-Type': 'application/json',
                  };
                  
                const response = await Axios.post(
                    'https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Orders',
                    {
                        fields: {
                            productid: { stringValue: curElm.id },
                            quantity: { integerValue: curElm.quantity },
                            shopid: { stringValue: "shop13" },
                            totalprice: { integerValue: curElm.quantity * curElm.price },
                            useruid: { stringValue: "asdfghjkl" },
                            // date: { stringValue: formattedDate },
                            date: {timestampValue : new Date().toISOString()}
                        },
                    },
                );
                if (response.status === 200) {
                    console.log('Data inserted successfully');
                }
                // Calculate the new stock value
            const newStock = curElm.stock - curElm.quantity;

            // Update the product's stock in Firestore
            await Axios.patch(
                `https://firestore.googleapis.com/v1/projects/abhiram-store2/databases/(default)/documents/Products/${curElm.id}`,
                {
                    fields: {
                        productname:{stringValue: curElm.productname},
                        price:{integerValue: curElm.price},
                        imageurl:{stringValue: curElm.imageurl},
                        category:{stringValue: curElm.category},
                        description:{stringValue: curElm.description},
                        stock: { integerValue: newStock },
                        shopid:{stringValue: curElm.shopid},
                    },
                },
            );

                

            }

            // Clear the cart after successful checkout
            setCart([]);
            window.location.reload();

        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }




  return (
    <div className='cart'>
        <h3>CART</h3>
        {
            cart.length === 0 &&
            <>
            <div className='empty_cart'>
                <h2>Your shopping cart is empty</h2>
                <Link to= '/shop'><button>SHOP NOW</button></Link>
                
            </div>
            </>
        }
        <div className='container'>
            {
                cart.map((curElm)=>
                {
                    return (
                        <> 
                        <div className='box'>
                            <div className='img_box'>
                                <img src={curElm.imageurl} alt="image" />
                            </div>
                            <div className='detail'>
                                <div className='info'>
                                    <h4>{curElm.category}</h4>
                                    <h3>{curElm.productname}</h3>
                                    <p>Price: ${curElm.price}</p>
                                    <p>Total:${curElm.price * curElm.quantity}</p>

                                </div>
                                
                                <div className='quantity'>
                                    <button onClick={()=>incqty(curElm)}>+</button>
                                    <input type="number" value={curElm.quantity} />
                                    <button onClick={()=>decqty(curElm)}>-</button>
                                </div>
                                <div className='icon'>
                                    <li onClick={()=> removeproduct(curElm)}><AiOutlineClose /></li>
                                </div>
                            </div>
                        </div>
                        </>
                    )
                })
            }
        </div>
        <div className='bottom'>
            {
                cart.length >0 &&
                <>
                    <div className='Total'>
                        <h4>Sub Total: ${total}</h4>
                    </div>
                    <button onClick={checkout}>checkout</button>

                
                </>
            }
        </div>
    </div>
  )
}

export default Cart