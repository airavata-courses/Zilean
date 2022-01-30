import { useState } from "react";
// import React {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken,setRefreshToken, setUserDetails, setIsAuthenticated, setLogout } from '../../slices/authSlice';

import { useCreateUserMutation } from '../../slices/authApi';

function index() {

  const [email,setEmail] = useState()
  const [password,setPassword]=useState()
  const [retypePassword,setRetypePassword]=useState()

  const [ createUser, { isLoading: createUserIsLoading, 
    isSuccess: createUserIsSuccess, 
    isError: createUserIsError,
    error: createUserError
     } ] = useCreateUserMutation();

  const access_token = useSelector((state)=>{
    return state.authReducer.access_token
  })
  const dispatch=useDispatch();

  // console.log("Before Dispatch: ", access_token);

  // dispatch(setAccessToken("access_token updated"));
  // dispatch(setRefreshToken("refresh_token_updated"));
  // dispatch(setUserDetails("xyz_updated@gmail.com"));
  // dispatch(setIsAuthenticated({email_id:"xyz@gmail.com", first_name:"Rushikesh", last_name:"Pharate"}));
  // dispatch(setLogout());

  // console.log("After Dispatch: ", access_token);

  const emailChangeHandler=(e)=>{
    setEmail(e.target.value);
    // console.log(email);
  }

  const passwordChangeHandler=(e)=>{
    setPassword(e.target.value);
    // console.log(password);
  }

  const retypePasswordChangeHandler=(e)=>{
    setRetypePassword(e.target.value);
    // console.log(retypePassword);
  }

  
  const formSubmitHandler= async (e)=>{
    e.preventDefault();
    if (password!=retypePassword){
      alert("Passwords do not match!");
    }else{
      await(createUser({"email":email, "password":password}));

    }

  }


  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            required
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter email"
            onChange={emailChangeHandler}
            
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            required
            type="password"
            name="password"
            autoComplete="on"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={passwordChangeHandler}
            
          />
        </div>
        <br/>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Retype Password</label>
          <input
            required
            type="password"
            name="password"
            autoComplete="on"
            className="form-control"
            id="exampleInputPassword2"
            placeholder="Password"
            onChange={retypePasswordChangeHandler}
            
          />
        </div>

        <div className="form-check"></div>
        <button type="submit" className="btn btn-primary" onClick={formSubmitHandler}>
          Submit
        </button >
      </form>
    </div>
  );
}

export default index;
