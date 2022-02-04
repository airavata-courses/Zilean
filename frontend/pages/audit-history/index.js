import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import setNextCursor from "../../slices/auditSlice";

import { useGetAuditsQuery } from "../../slices/auditApi";

const index = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const email = useSelector((state) => state.authReducer.user_details.email);
  const access_token = useSelector((state) => state.authReducer.access_token);
  const next_cursor = useSelector((state) => state.auditReducer.next_cursor);
  // console.log("next_cursor: ", next_cursor);

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
      console.log(getAuditsData.data);
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
      <div >
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Service</th>
              <th scope="col">Request</th>
              <th scope="col">Response</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {getAuditsIsSuccess &&
              getAuditsData.data.map((itm, key) => {
                //  return <div>{itm.service_provider_identifier}</div>
                return (
                  <tr key={key}>
                    <th scope="row">{email}</th>
                    <td>{itm.service_provider_identifier}</td>
                    <td>{JSON.stringify(itm.request)}</td>
                    <td>{JSON.stringify(itm.response)}</td>
                    <td>{itm.created_at.toLocaleString("en-US")}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default index;
