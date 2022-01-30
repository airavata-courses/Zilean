import React, { useState } from "react";
import Link from "next/link";

function Index() {

  const [email,setEmail] = useState();
  const [password,setPassword]=useState();

  const emailChangeHandler=(e)=>{
    setEmail(e.target.value);
    // console.log(email);
  }

  const passwordChangeHandler=(e)=>{
    setPassword(e.target.value);
    // console.log(password);
  }

  const formOnSubmitHandler=(e)=>{
    e.preventDefault();

  }
  
  return (
    <div>
      <form >
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
        <button type="submit" className="btn btn-primary" onClick={formOnSubmitHandler}>
          Submit
        </button>
        <br />
        <small>
          Don't have an account?{" "}
          <Link href="/signup" style={{ backgound: "blue" }} passHref>
            SignUp here
          </Link>
        </small>
      </form>
    </div>
  );
}

export default Index;

