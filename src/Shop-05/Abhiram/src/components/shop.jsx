import React, { useEffect, useState } from 'react'
import '../styles/shop.css'
import {AiFillEye, AiOutlineClose} from 'react-icons/ai';
import ProductDetail from './ProductDetail';
import { Link, useNavigate } from 'react-router-dom';




const Shop = ({shop, Filter,allcatefilter, addtocart, defaultshop}) => {
  
    
    const [showDetails, setShowDetails] = useState(false)
    const [detail, setDetail] = useState([])
    const detailpage = (product)=>
    {
        const detaildata = ([{product}])
        const productdetails = detaildata[0]['product']
        // console.log(productdetails)
        setDetail(productdetails)
        setShowDetails(true)
    }
    const closedetail=()=>
    {
        setShowDetails(false)
    }
    useEffect(()=>{
        defaultshop;
    })



    return (
    <>
    {/* {
        showDetails?
        <>
            <div className='product_detail'>
            <button className='close_btn' onClick={closedetail}><AiOutlineClose /></button>
            <div className='container'>
                <div className='img_box'>
                    <img src={detail.imageurl} alt=''></img>
                </div>
                <div className='info'>
                    <h4># {detail.category}</h4>
                    <h2>{detail.productname}</h2>
                    <p>{detail.description}</p>
                    <h3>${detail.price}</h3>
                    <button onClick={() => addtocart (detail)}>Add To Cart</button>
                </div>
            </div>
        </div>
        </>
        : null
    } */}

    
        <div className='shop'>
            {/* <h2>shop</h2>
            <p>Home . shop</p> */}
            <div className='container'>
                {/* <div className='left_box'>
                    <div className='category'> */}
                        {/* <div className='header'>
                            <h2>All Categories</h2>
                        </div> */}
                        {/* <div className='box'> */}
                            {/* <ul> */}
                                {/* <li onClick={()=>allcatefilter ()}>#All</li> */}
                                {/* <li onClick={()=> Filter ("desktop")}>#Desktop</li>
                                <li onClick={()=> Filter ("motherboard")}>#MotherBoard</li>
                                <li onClick={()=> Filter ("keyboard")}>#Keyboard</li>
                                <li onClick={()=> Filter ("mouse")}>#Mouse</li>
                                <li onClick={()=> Filter ("cable")}>#Cables</li>
                                <li onClick={()=> Filter ("laptop")}>#Laptop</li> */}
                                {/* <li >#Desktop</li>
                                <li >#MotherBoard</li>
                                <li >#Keyboard</li>
                                <li >#Mouse</li>
                                <li >#Cables</li>
                                <li >#Laptop</li> */}

                            {/* </ul>
                        </div>
                    </div>

                </div> */}
                <div className='right_box'>
                    <div className='banner'>
                        <div className='img_box'>
                        </div>
                    </div>
                    <div className='product_box'>
                        <h2>Shop product</h2>
                        <div className='product_container'>
                            {
                                shop.map((curElm)=>
                                {
                                    return(
                                        <>
                                        <div className='box' key={curElm.id}>
                                            <div className='img_box'>
                                            <img src={curElm.imageurl} alt='shopimage' />
                                            <div className='icon'>
                                            <Link to={`${curElm.id}`}><li onClick={() => detailpage(curElm)}>
                                                <AiFillEye />
                                                </li></Link>
                                            </div>
                                            </div>
                                            <div className='detail'>
                                                <h3>{curElm.productname}</h3>
                                                <p>{curElm.price}</p>
                                                {/* <button onClick={()=> checkauth(curElm)}>Add to cart</button> */}
                                            </div>
                                        </div>
                                        </>
                                    )
                                })
                            }
                            
                        </div>

                        

                    </div>
                </div>
            </div>
            
        </div>
    

    
    </>
  );
};

export default Shop