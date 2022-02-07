import React from 'react';
import { useRouter } from "next/router";
import {useSelector} from 'react-redux';
;


const index = () => {

  const curr_plot_link = useSelector((state)=>state.plotDataReducer.curr_plot_link)
  console.log(curr_plot_link)

  return <div>
    {
      curr_plot_link=="NEXRAD-S3-LINK-NOT-FOUND" ? <h3>NEXRAD-S3-LINK-NOT-FOUND</h3> : <img src={curr_plot_link}/>
    }
    
  </div>;
};

export default index;
