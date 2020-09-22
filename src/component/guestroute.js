import { Redirect, Route } from "react-router-dom";

import React from "react";

function GuestRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <Redirect to="/home" />
        ) : (
         <Component {...props} />
        )
      }
    />
  );
}

export default GuestRoute;
