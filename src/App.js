import { Route, Switch }    from 'react-router-dom';

import Home from './component/home';
import Login from './component/login';
import React from 'react';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path='/home' component={Home} />
      </Switch>
    </div>
  );
}

export default App;
