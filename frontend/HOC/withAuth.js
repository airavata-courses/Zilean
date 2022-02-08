// HOC/withAuth.jsx
import { useRouter } from "next/router";

import {useSelector} from 'react-redux';
import { useEffect } from "react";


const withAuth = (WrappedComponent) => {
    
    
  return (props) => {
    const Router = useRouter();
    const isAuthenticated = useSelector((state)=>state.authReducer.isAuthenticated)
    console.log("inside withAuth: ",isAuthenticated)
    useEffect(()=>{
        if (!isAuthenticated) {
            Router.replace("/login");
          }else{
            return <WrappedComponent {...props} />;
          }

    },[isAuthenticated])
    
    // // checks whether we are on client / browser or server.
    // if (typeof window !== "undefined") {
      

    // //   const accessToken = localStorage.getItem("accessToken");
    
    //   // If there is no access token we redirect to "/" page.
    //   if (!isAutheticated) {
    //     Router.replace("/login");
    //   }

    //   // If this is an accessToken we just render the component that was passed with all its props
    //   return <WrappedComponent {...props} />;
    // }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;