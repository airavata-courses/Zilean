import { useEffect, useState } from "react";
// import React {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
// import { setAccessToken,setRefreshToken, setUserDetails, setIsAuthenticated, setLogout } from '../../slices/authSlice';

import { useCreateUserMutation } from '../../slices/authApi';
import { useRouter } from "next/router";

function index() {

  const [email,setEmail] = useState()
  const [password,setPassword]=useState()
  const [retypePassword,setRetypePassword]=useState()

  const router=useRouter()

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
    }else if(!email.includes('@')){
      alert("Email not valid")
      
    }else{
      
      await(createUser({"email":email, "password":password}));

    }

  }

  useEffect(()=>{
    if(createUserIsSuccess){
      router.push('/login')
    }

  },[createUserIsSuccess])


  return (
    <div>
      {createUserIsError && (
        <div className="alert alert-danger" role="alert">
          {/* here u can't directly posts  error as  createUserError because react can't render janascript object and createUserError is a object with 2 keys --> status and error. */}
          {createUserError.status}:{createUserError.error}
        </div>
      )}
      <form className="was-validated">
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter email"
            onChange={emailChangeHandler}
            required
            
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
