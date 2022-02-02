import React from "react";
import classes from "./MainNavigation.module.css";
import Link from "next/dist/client/link";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../slices/authSlice";
import Router from "next/router";

function MainNavigation() {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const username = useSelector(
    (state) => state.authReducer.user_details.username
  );

  const dispatch = useDispatch();
  const logOutHandler = (e) => {
    e.preventDefault();
    dispatch(setLogout());
    Router.push("login/");
  };

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Weather App</div>
      </Link>
      <nav className={classes.nav}>
        {!isAuthenticated && (
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
          </ul>
        )}

        {isAuthenticated && (
          <ul>
            <li>
              {" "}
              <Link href="/requests" passHref>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  Requests
                </button>
              </Link>
            </li>
            <li>
              {" "}
              <Link href="/audit-history" passHref>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  Audit History
                </button>
              </Link>
            </li>
            <li>
              {" "}
              {/* <Link href="#" passHref> */}
                <button type="button" className="btn btn-outline-dark">
                  {username}
                </button>
              {/* </Link> */}
            </li>
            <li>
              {" "}
              <Link href="#" passHref>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={logOutHandler}
                >
                  Logout
                </button>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default MainNavigation;
