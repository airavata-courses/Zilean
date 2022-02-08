import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/globals.css";
import Layout from "../components/layout/Layout";

import PrivateRoute from "../utils/PrivateRoute";
import { Provider } from "react-redux";
import { store } from "../store/store";

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
// import SSRProvider from 'react-bootstrap/SSRProvider';

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          {/* <PrivateRoute/> */}
            <Component {...pageProps} />
          {/* </PrivateRoute> */}
        </Layout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
