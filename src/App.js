import { Redirect, Route, Switch }    from 'react-router-dom';

import Home from './component/home';
import Login from './component/login';
import React from 'react';
import { isEmpty } from 'lodash';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        {!isEmpty(token) && token ?
          <Route exact path='/home' component={Home} />
          :
          <Redirect to="/" />
        }
      </Switch>
    </div>
  );
}

export default App;
