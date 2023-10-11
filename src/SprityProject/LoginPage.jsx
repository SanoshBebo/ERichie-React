import React from 'react'
import { Navigate } from 'react-router-dom'

const checklogin = () =>{
    if(user.role == "shopkeeper"){
        Navigate('/admin')
    }else{
        Navigate('/customerHomepage')
    }
}
const LoginPage = () => {
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage