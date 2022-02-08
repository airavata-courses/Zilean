import React from 'react';

import { useSelector } from 'react-redux';
import {useRouter} from 'next/router';


const PrivateRoute = (props) => {

    const router = useRouter();

    const isAuthenticated = useSelector((state)=>state.authReducer.isAuthenticated)
    // console.log(isAuthenticated)
  
    const redirectToLogin=()=>{
        router.push('/login')
    }

  return <div>
      { !isAuthenticated ? router.push('/login') : props.children}
  </div>;
};

export default PrivateRoute;
