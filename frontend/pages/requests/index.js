import React from "react";
import { useEffect } from "react";
import {useRouter} from 'next/router';

import { useSelector } from "react-redux";
import { useGetRequestsHistoryQuery } from "../../slices/plotDataApi";

import Btn from "../../components/ui/Btn";

const index = () => {

    const router = useRouter()
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

  const onPlotDataButtonHandler = (e) => {
    e.preventDefault();
    // console.log("Clicked");
    router.push('/user-input');
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
            <p>Want to plot more data??</p>
            <span></span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPlotDataButtonHandler}
          >
            Plot Data
          </button>

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Request</th>
                <th scope="col">Date and Time</th>
                <th scope="col">Status</th>
                <th scope="col">Plot</th>
              </tr>
            </thead>
            <tbody>
              {getRequestsHostoryIsSuccess &&
                getRequestsHostoryData.plots.map((itm, key) => {
                  //  return <div>{itm.service_provider_identifier}</div>
                  return (
                    <tr key={key}>
                      <th scope="row">{itm.request ? JSON.stringify(itm.request) : 'Does not exist'}</th>
                      <td>{itm.created_at}</td>
                      <td>{itm.status ? itm.status : 'Does not exist'}</td>
                      <td>   
                        <Btn link={itm.plot_link} status={itm.status} key={key} />   
                        
                      </td>
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
