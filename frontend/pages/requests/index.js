import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetRequestsHistoryQuery } from "../../slices/plotDataApi";

import Btn from "../../components/ui/Btn";

const index = () => {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const access_token = useSelector((state) => state.authReducer.access_token);
  //   console.log(access_token);

  const {
    data: getRequestsHostoryData,
    isLoading: getRequestsHostoryIsLoading,
    isSuccess: getRequestsHostoryIsSuccess,
    isError: getRequestsHostoryIsError,
    error: getRequestsHostoryError,
  } = useGetRequestsHistoryQuery({ access_token: access_token });

  useEffect(() => {
    if (getRequestsHostoryIsSuccess) {
      console.log(getRequestsHostoryData);
    }
  }, [getRequestsHostoryIsSuccess]);

  const historyPlotHandler = (e) => {
    e.preventDefault();
    console.log();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Requests Page</p>

          {/* <img src='http://localhost:4566/plots/0de1e309-d849-4704-baca-eae36d1e4212.png'/> */}

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Request Date and Time</th>
                <th scope="col">Plot</th>
              </tr>
            </thead>
            <tbody>
              {getRequestsHostoryIsSuccess &&
                getRequestsHostoryData.plots.map((itm, key) => {
                  //  return <div>{itm.service_provider_identifier}</div>
                  return (
                    <tr key={key}>
                      <th scope="row">{itm.created_at}</th>
                      <td><Btn link={itm.plot_link} key={key} /></td>

                    </tr>
                  );
                })}

              
            </tbody>
          </table>
        </div>
      ) : (
        <div>Please login/signup to plot weather data....</div>
      )}
    </div>
  );
};

export default index;
