import React from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);

    if(token === null) {
        toast.error("You need to login first");
        return <Navigate to="/login" />
    }
    else 
        return children
}

export default PrivateRoute