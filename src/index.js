import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import reducer from "./reducer/reducer";
import { createStore } from "redux";
import { SnackbarProvider } from "notistack";

const stores = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={stores}>
      <SnackbarProvider
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
        autoHideDuration={4000}
        maxSnack={3}
      >
        <App />
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
