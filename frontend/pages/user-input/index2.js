import React from "react";
import { useEffect } from "react";

const stations =["KABR","KAKQ","KAMX","KAPX","KATX","KBBX","KBGM","KBIS","KCLE","KCLX"];

function index() {

  useEffect(() => {
    let year_option = "<option value='0'>SelectYear</option>";
    for (let i = 1991; i < 2022; i++) {
      year_option += "<option value='" + i + "'>" + i + "</option>";
    }
    document.getElementById("year-options").innerHTML = year_option;
  }, [document.getElementById("year-options")]);

  useEffect(()=>{
    let month_option = "<option value='0'>SelectMonth</option>";
    for (let i = 1; i < 13; i++) {
      month_option += "<option value='" + i + "'>" + i + "</option>";
    }
    document.getElementById("month-options").innerHTML = month_option;

  },[document.getElementById("month-options")])

  useEffect(()=>{
    let day_option = "<option value='0'>SelectDay</option>";
    for (let i = 1; i < 32; i++) {
      day_option += "<option value='" + i + "'>" + i + "</option>";
    }
    document.getElementById("day-options").innerHTML = day_option;

  },[document.getElementById("day-options")])


  const getYearValue = () => {
    var e = document.getElementById("year-options");
    var year_value = e.options[e.selectedIndex].value;
    console.log(year_value);
  };

  const getMonthValue = () => {
    var e = document.getElementById("month-options");
    var month_value = e.options[e.selectedIndex].value;
    console.log(month_value);
  };
  const getDayValue = () => {
    var e = document.getElementById("day-options");
    var day_value = e.options[e.selectedIndex].value;
    console.log(day_value);
  };

  const getStationValue = () => {
    var e = document.getElementById("day-options");
    var day_value = e.options[e.selectedIndex].value;
    console.log(day_value);
  };

  return (
    <div>
       <div class="d-flex ">
        <div class="p-2">
          <div className="mb-2">
            <label className="pl-2 pr-2"> Select year </label>
          </div>
          <select
            className="custom-select"
            id="year-options"
            onChange={getYearValue}
          ></select>
        </div>

        <div class="p-2">
        <div className="mb-2">
            <label className="pl-2 pr-2"> Select Month </label>
          </div>
          <select
            className="custom-select"
            id="month-options"
            onChange={getMonthValue}
          ></select>
        </div>


        <div class="p-2">
        <div className="mb-2">
            <label className="pl-2 pr-2"> Select Day </label>
          </div>
          <select
            className="custom-select"
            id="day-options"
            onChange={getDayValue}
          ></select>
        </div>

        <div class="p-2">
          <div className="mb-2">
            <label className="pl-2 pr-2"> Select Station </label>
          </div>
          <select
            className="custom-select"
            id="station-options"
            onChange={getStationValue}
          ></select>
        </div>

      </div>
    </div>
  );
}

export default index;
