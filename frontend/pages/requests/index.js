import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetRequestsHistoryQuery } from "../../slices/plotDataApi";
const index = () => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const access_token = useSelector((state) => state.authReducer.access_token)
//   console.log(access_token);

  const {
    data: getRequestsHostoryData,
    isLoading: getRequestsHostoryIsLoading,
    isSuccess: getRequestsHostoryIsSuccess,
    isError: getRequestsHostoryIsError,
    error: getRequestsHostoryError,
  } = useGetRequestsHistoryQuery({ access_token: access_token });
  
  useEffect(()=>{
      if(getRequestsHostoryIsSuccess){
        console.log(getRequestsHostoryData);
      }

  },[getRequestsHostoryIsSuccess])

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Requests Page</p>
          {/* <img src='http://localhost:4566/plots/0de1e309-d849-4704-baca-eae36d1e4212.png'/> */}
        </div>
      ) : (
        <div>Please login/signup to plot weather data....</div>
      )}
    </div>
  );
};

export default index;
