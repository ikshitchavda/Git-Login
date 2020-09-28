import GuestRoute from "./component/guestroute";
import Home from './component/home'
import Login from './component/login';
import PrivateRoute from "./component/privateRoute";
import React from "react";
import { Switch } from "react-router-dom";

function App() {
  return (
    <>
      <Switch>
        <GuestRoute exact path="/" component={Login} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/starred" component={Home} />
      </Switch>
    </>
  );
}

export default App;
