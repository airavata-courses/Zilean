import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import setNextCursor from "../../slices/auditSlice";

import { useGetAuditsQuery } from "../../slices/auditApi";

const index = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const access_token = useSelector((state) => state.authReducer.access_token);
  const next_cursor = useSelector((state) => state.auditReducer.next_cursor);
  console.log("next_cursor: ", next_cursor);

  const {
    data: getAuditsData,
    isLoading: getAuditsIsLoading,
    isSuccess: getAuditsIsSuccess,
    isError: getAuditsIsError,
    error: getAuditsError,
  } = useGetAuditsQuery({
    access_token: access_token,
    next_cursor: next_cursor,
  });

  useEffect(() => {
    if (getAuditsIsSuccess) {
      console.log("Get Audits data:", getAuditsData);
      console.log(getAuditsData.data)
    }
  }, [getAuditsIsSuccess]);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Audit History</p>
        </div>
      ) : (
        <div>Please login/signup to plot weather data....</div>
      )}
      {getAuditsIsSuccess && <ul>
        {getAuditsData.data.map((itm,key)=>{
          return (<li>Service identigier:{itm.service_provider_identifier}|| Request:{itm.request} || Response:{itm.response}</li>)
        })}
        </ul>}
    </div>
  );
};

export default index;
