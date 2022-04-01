import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { usePostDataMutation } from "../../slices/plotDataApi";

import { useDispatch, useSelector } from "react-redux";

import {
  incrementQueueCount,
  decrementQueueCount,
  setIsQueued,
} from "../../slices/plotDataSlice";

const stations = [
  "KABR",
  "KENX",
  "KABX",
  "KFDR",
  "KAMA",
  "PAHG",
  "PGUA",
  "KFFC",
  "KEWX",
  "KBBX",
  "PABC",
  "KBLX",
  "KBGM",
  "KBMX",
  "KBIS",
  "KCBX",
  "KBOX",
  "KBRO",
  "KBUF",
  "KCXX",
  "RKSG",
  "KFDX",
  "KICX",
  "KCLX",
  "KRLX",
  "KCYS",
  "KLOT",
  "KILN",
  "KCLE",
  "KCAE",
  "KGWX",
  "KCRP",
  "KFWS",
  "KDVN",
  "KFTG",
  "KDMX",
  "KDTX",
  "KDDC",
  "KDOX",
  "KDLH",
  "KDYX",
  "KEYX",
  "KEVX",
  "KEPZ",
  "KLRX",
  "KBHX",
  "PAPD",
  "KFSX",
  "KHPX",
  "KGRK",
  "KPOE",
  "KEOX",
  "KSRX",
  "KIWX",
  "KAPX",
  "KGGW",
  "KGLD",
  "KMVX",
  "KGJX",
  "KGRR",
  "KTFX",
  "KGRB",
  "KGSP",
  "KRMX",
  "KUEX",
  "KHDX",
  "KCBW",
  "KHGX",
  "KHTX",
  "KIND",
  "KJKL",
  "KJAN",
  "KJAX",
  "RODN",
  "PHKN",
  "KEAX",
  "KBYX",
  "PAKC",
  "KMRX",
  "RKJK",
  "KARX",
  "LPLA",
  "KLCH",
  "KESX",
  "KDFX",
  "KILX",
  "KLZK",
  "KVTX",
  "KLVX",
  "KLBB",
  "KMQT",
  "KMXX",
  "KMAX",
  "KMLB",
  "KNQA",
  "KAMX",
  "PAIH",
  "KMAF",
  "KMKX",
  "KMPX",
  "KMBX",
  "KMSX",
  "KMOB",
  "PHMO",
  "KVAX",
  "KMHX",
  "KOHX",
  "KLIX",
  "KOKX",
  "PAEC",
  "KAKQ",
  "KLNX",
  "KTLX",
  "KOAX",
  "KPAH",
  "KPDT",
  "KDIX",
  "KIWA",
  "KPBZ",
  "KSFX",
  "KGYX",
  "KRTX",
  "KPUX",
  "KRAX",
  "KUDX",
  "KRGX",
  "KRIW",
  "KFCX",
  "KJGX",
  "KDAX",
  "KLSX",
  "KMTX",
  "KSJT",
  "KNKX",
  "KMUX",
  "KHNX",
  "TJUA",
  "KSOX",
  "KATX",
  "KSHV",
  "KFSD",
  "PACG",
  "PHKI",
  "PHWA",
  "KOTX",
  "KSGF",
  "KCCX",
  "KLWX",
  "KTLH",
  "KTBW",
  "KTWX",
  "KEMX",
  "KINX",
  "KVNX",
  "KVBX",
  "KICT",
  "KLTX",
  "KYUX",
];

const request_types = ["NEXRAD", "MERRA"];

function index() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [station, setStation] = useState("");
  const [requestType, setRequestType] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const email = useSelector((state) => state.authReducer.user_details.email);
  const access_token = useSelector((state) => state.authReducer.access_token);

  const [
    postData,
    {
      isLoading: postDataIsLoading,
      isSuccess: postDataIsSuccess,
      isError: postDataIsError,
      error: postDataError,
    },
  ] = usePostDataMutation();

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = String(today.getFullYear());

  const hour = String(today.getHours()); // => 9
  const min = String(today.getMinutes()); // =>  30
  const sec = String(today.getSeconds()); // => 51

  useEffect(() => {
    if (isAuthenticated && requestType == "NEXRAD") {
      let station_option = "<option value='0'>SelectStation</option>";

      for (let i = 0; i < stations.length; i++) {
        station_option +=
          "<option value='" + stations[i] + "'>" + stations[i] + "</option>";
      }
      document.getElementById("station-options").innerHTML = station_option;
    }
  }, [document.getElementById("station-options")]);

  useEffect(() => {
    if (isAuthenticated) {
      let request_type_option = "<option value='0'>SelectRequestType</option>";

      for (let i = 0; i < request_types.length; i++) {
        request_type_option +=
          "<option value='" +
          request_types[i] +
          "'>" +
          request_types[i] +
          "</option>";
      }
      document.getElementById("request-type").innerHTML = request_type_option;
    }
  }, [document.getElementById("request-type")]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const getStationValue = () => {
    var e = document.getElementById("station-options");
    var station_value = e.options[e.selectedIndex].value;
    setStation(station_value);
  };

  const getRequestType = () => {
    var e = document.getElementById("request-type");
    var request_type = e.options[e.selectedIndex].value;
    setRequestType(request_type);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(date);
    // console.log(time);
    // console.log(station);
    if (requestType == 'NEXRAD') {
      const submitRequestBody = {
        date: date,
        time: time,
        station: station,
        type: 'nexrad',
        access_token: access_token,
      };

      console.log(submitRequestBody);
      await postData(submitRequestBody);

    }

    if (requestType == 'MERRA') {
      const submitRequestBody = {
        date: date,
        time: time,
        type: 'merra',
        access_token: access_token,
      };

      console.log(submitRequestBody);
      await postData(submitRequestBody);


    }

    // console.log(submitRequestBody);
    // await postData(submitRequestBody);
  };

  useEffect(() => {
    if (postDataIsSuccess) {
      console.log("Success");

      dispatch(incrementQueueCount(1));
      dispatch(setIsQueued(true));
      // router.push('/')
    }
  }, [postDataIsSuccess]);

  // console.log(requestType);

  return (
    <div>
      {postDataIsSuccess && (
        <div className="alert alert-success" role="success">
          Your request will be processed. Keep checking requests tab.
        </div>
      )}

      {postDataIsError && (
        <div className="alert alert-danger" role="danger">
          Something went wrong.
        </div>
      )}
      {isAuthenticated ? (
        <form>
          <div className="mt-2 mb-2">
            <label htmlFor="birthday">Request Type: </label>
            <span> </span>
            <select
              className="custom-select"
              id="request-type"
              onChange={getRequestType}
            ></select>
          </div>

          {requestType == "NEXRAD" && (
            <div>
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Select Date:</label>
                <span> </span>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  onChange={handleDateChange}
                  min="1992-01-01"
                  max={`${yyyy}-${mm}-${dd}`}
                  value={date}
                ></input>
              </div>
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Select Time:</label>
                <span> </span>
                <input
                  type="time"
                  id="birthday"
                  name="birthday"
                  onChange={handleTimeChange}
                  max={`${hour}-${min}`}
                  value={time}
                ></input>
              </div>

              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Select Station: </label>
                <span> </span>
                <select
                  className="custom-select"
                  id="station-options"
                  onChange={getStationValue}
                ></select>
              </div>

              <div className="form-check"></div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitHandler}
              >
                Submit
              </button>
            </div>
          )}

          {requestType == "MERRA" && (
            <div>
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Select Date:</label>
                <span> </span>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  onChange={handleDateChange}
                  min="1992-01-01"
                  max={`${yyyy}-${mm}-${dd}`}
                  value={date}
                ></input>
              </div> 
              <div className="mt-2 mb-2">
                <label htmlFor="birthday">Select Time:</label>
                <span> </span>
                <input
                  type="time"
                  id="birthday"
                  name="birthday"
                  onChange={handleTimeChange}
                  max={`${hour}-${min}`}
                  value={time}
                ></input>
              </div>
              <div className="form-check"></div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitHandler}
              >
                Submit
              </button>
            </div>
          )}
        </form>
      ) : (
        <div>Please login/signup to plot weather data....</div>
      )}
    </div>
  );
}

export default index;
