import React, { useReducer } from "react";
import { Redirect, Route } from "react-router-dom";
import { initialState, reducer } from "../store";

import NewContext from "./context";

function PrivateRoute({ component: Component, ...rest }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
    return (
      <Route
        {...rest}
        render={(props) =>
          localStorage.getItem("token") ? (
            <NewContext.Provider value={{ state, dispatch }}>
              <Component {...props} />
            </NewContext.Provider>
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
}

export default PrivateRoute;