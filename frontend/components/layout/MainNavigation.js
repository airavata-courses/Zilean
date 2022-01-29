import React from "react";
import classes from "./MainNavigation.module.css";
import Link from "next/dist/client/link";

import { useDispatch } from 'react-redux';
import {setLogout} from '../../slices/authSlice';

function MainNavigation() {

  const dispatch=useDispatch();
  const logOutHandler=(e)=>{
    e.preventDefault();
    dispatch(setLogout());


  }


  return (
    <header className={classes.header}>
      <Link href='/'>
      <div className={classes.logo}>Weather App</div>
      </Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            {" "}
            <Link href="/login" passHref>
              <button type="button" className="btn btn-primary">
                LogIn
              </button>
            </Link>
          </li>
          <li>
            {" "}
            <Link href="/signup" passHref>
              <button type="button" className="btn btn-primary">
                SignUp
              </button>
            </Link>
          </li>
          <li>
            {" "}
            <Link href="#" passHref>
              <button type="button" className="btn btn-primary" onClick={logOutHandler}>
                Logout
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
