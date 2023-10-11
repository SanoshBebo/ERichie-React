import ShoppingPage from '../pages/ShoppingPage'

import LoginPage from '../pages/LoginPage'
import AdminPage from '../pages/AdminPage'

import ProductPage from '../pages/ProductPage'

import Dashboard from '../components/admin-page/dashboard/Dashboard'
import Products from '../components/admin-page/products/ProductList'

import PrivateRoute from './../components/shared/PrivateRoute';
import ProductDescriptionPage from '../pages/ProductDescription'

const routes=[
    {
        path: '/',
        element:<ShoppingPage />,
    },
    {
        path: '/my-orders',
       
    },
 
    {
        path: '/admin',
        element:<LoginPage />,
    },
    {
        path: '/:id',
        element:<ProductPage />,
    },
    {
        path: '/admin-page',
        element:<AdminPage />,
        auth:true,
        children:[
            {
                index:true,
                element:<Dashboard />,
            },
            {
                path: 'products',
                element:<Products />,
            },
        ]
    },
   
]

const authCheck = routes => routes.map(route => {
	if (route?.auth) {
		route.element = <PrivateRoute>{route.element}</PrivateRoute>
	}
	return route
})


export default authCheck(routes)