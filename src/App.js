import React from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './messenger/Main';
import Signin from './user/Signin';
import Signup from './user/Signup';
import ThreadInitiator from './messenger/ThreadInitiator';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/initiate/:userID" children={<ThreadInitiator/>}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
