import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/Room-section/CreateRoom";
import Room from "./components/Room-section/Room";
import LoginPage from "./components/Home-section/Nav-layout/LoginPage";
import RegisterPage from "./components/Home-section/Nav-layout/RegisterPage";
import PrivateRoute from "./components/authorization-authenticate-section/PrivateRoute";
import Email from "./components/Email-section/Email";
import Dashboard from './components/Home-section/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <PrivateRoute exact path="/" component={CreateRoom} />
        <Route exact path="/room/:roomID" component={Room} />
        <PrivateRoute exact path="/email" component={Email} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
