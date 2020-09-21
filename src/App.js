import { Redirect, Route, Switch }    from 'react-router-dom';

import Home from './component/home';
import Login from './component/login';
import PrivateRoute from "./privateRoute";
import React from 'react';
import Starred from './component/starred';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/starred" component={Starred} />
      </Switch>
    </div>
  );
}

export default App;
