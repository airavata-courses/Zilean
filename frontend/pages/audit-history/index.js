import React from 'react';
import {useSelector} from 'react-redux';


const index = () => {

    const isAuthenticated=useSelector((state)=>state.authReducer.isAuthenticated)

  return <div>

    {isAuthenticated ?
      <div>
          <p>Audit History</p>
      </div> : <div>
      Please login/signup to plot weather data....
      </div> }


  </div>;
};

export default index;
