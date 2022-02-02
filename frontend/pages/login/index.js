import React, { useEffect, useState } from "react";
import Link from "next/link";
import {useRouter} from 'next/router';

import {useSelector,useDispatch} from 'react-redux';

import { useLogInUserMutation } from "../../slices/authApi";
import {setAccessToken, setRefreshToken, setUserDetails, setIsAuthenticated } from '../../slices/authSlice';


function Index() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const router = useRouter()
  
  // actions creators to change state
  const dispatch = useDispatch()

  const [
    logInUser,
    { data: logInUserResponse,
      isError: logInUserIsLoading,
      isSuccess: logInUserIsSuccess,
      isError: logInUserIsError,
      error: logInUserError,
    },
  ] = useLogInUserMutation();

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    // console.log(email);
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    // console.log(password);
  };

  const formOnSubmitHandler = async (e) => {
    e.preventDefault();
    await logInUser({username: email, password: password})
    
  };

  useEffect(()=>{
    if(logInUserIsSuccess){
      // console.log(logInUserResponse)
      dispatch(setIsAuthenticated(true))
      dispatch(setAccessToken(logInUserResponse.access))
      dispatch(setRefreshToken(logInUserResponse.refresh))
      dispatch(setUserDetails({"username": email}))
      router.push('/')
      
    }
  },[logInUserIsSuccess])

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={emailChangeHandler}
          />
          <br />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="on"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={passwordChangeHandler}
          />
        </div>
        <div className="form-check"></div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={formOnSubmitHandler}
        >
          Submit
        </button>
        <br />
        <small>
          Don't have an account?{" "}
          <Link href="signup/" style={{ backgound: "blue" }} passHref>
            SignUp here
          </Link>
        </small>
      </form>
    </div>
  );
}

export default Index;
