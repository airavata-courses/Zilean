import React, { useEffect } from "react";
import classes from "./MainNavigation.module.css";
import Link from "next/dist/client/link";

import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../slices/authSlice";
import Router from "next/router";

import { useLogOutUserMutation } from "../../slices/authApi";

function MainNavigation() {
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const access_token = useSelector((state) => state.authReducer.access_token);
  const email = useSelector((state) => state.authReducer.user_details.email);

  const [
    logOutUser,
    {
      isSuccess: logOutUserIsSuccess,
      isLoading: logOutUserIsLoading,
      isError: logOutUserIsError,
      error: logOutUserError,
    },
  ] = useLogOutUserMutation();

  const dispatch = useDispatch();

  const logOutHandler = async (e) => {
    e.preventDefault();
    await logOutUser({ access_token: access_token });
  };

  useEffect(() => {
    if (logOutUserIsSuccess) {
      dispatch(setLogout());
      Router.push("login/");
    }
  }, [logOutUserIsSuccess]);
  
  // console.log(logOutUserError);

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
                <button type="button" className="btn btn-primary">
                  Requests
                </button>
              </Link>
            </li>
            <li>
              {" "}
              <Link href="/audit-history" passHref>
                <button type="button" className="btn btn-primary">
                  Audit History
                </button>
              </Link>
            </li>
            <li>
              {" "}
              {/* <Link href="#" passHref> */}
              <button type="button" className="btn btn-outline-dark">
                {email}
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

          { logOutUserIsError && <li>(
                <small>Error Logging out</small>
              )</li>}
          </ul>
        )}
      </nav>
    </header>
  );
}

export default MainNavigation;
