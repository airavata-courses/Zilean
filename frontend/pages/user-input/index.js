import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { usePostDataMutation } from '../../slices/plotDataApi';

import { useDispatch, useSelector } from "react-redux";

const stations = [
  "KABR",
  "KAKQ",
  "KAMX",
  "KAPX",
  "KATX",
  "KBBX",
  "KBGM",
  "KBIS",
  "KCLE",
  "KCLX",
];

function index() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [station, setStation] = useState("");

  const dispatch = useDispatch();
  const isAuthenticated=useSelector((state)=>state.authReducer.isAuthenticated)

  const [postData, {isLoading: postDataIsLoading, isSuccess: postDataIsSuccess, isError: postDataIsError, error: postDataError }] = usePostDataMutation();

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = String(today.getFullYear());

  const hour = String(today.getHours()); // => 9
  const min = String(today.getMinutes()); // =>  30
  const sec = String(today.getSeconds()); // => 51

  useEffect(() => {
    if(isAuthenticated){
    let station_option = "<option value='0'>SelectStation</option>";

    for (let i = 0; i < stations.length; i++) {
      station_option +=
        "<option value='" + stations[i] + "'>" + stations[i] + "</option>";
    }
    document.getElementById("station-options").innerHTML = station_option;
  }
  }, [document.getElementById("station-options")]);

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

  const submitHandler =  async (e)=>{
    e.preventDefault();
    // console.log(date);
    // console.log(time);
    // console.log(station);
    const submitRequestBody ={
        date:date, 
        time:time, 
        station:station
    }

    await (postData(submitRequestBody));

  }

  return (
    <div>
      { isAuthenticated ?
      <form>
        <div className="mt-2 mb-2">
          <label htmlFor="birthday">Select Date:</label>
          <span> {' '} </span>
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
          <span> {' '} </span>
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
          <span> {' '} </span>
          <select
            className="custom-select"
            id="station-options"
            onChange={getStationValue}
          ></select>
        </div>
        
        <div className="form-check"></div>
        <button type="submit" className="btn btn-primary" onClick={submitHandler} >
          Submit
        </button >

      </form> :<div>
      Please login/signup to plot weather data....
      </div >
}
    </div>
  );
}

export default index;
