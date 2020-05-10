import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
// import Chat from "./container/Chat";
import { Homepage } from "./container/Homepage";
import Setting from "./container/Setting";
import Game from "./container/Game";

function App() {
  return (
    <Router>
      <div>
        {/* <Chat /> */}
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/setting">
            <Setting />
          </Route>
          <Route exact path="/game">
            <Game />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
