import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/Room-section/CreateRoom";
import Room from "./components/Room-section/Room";
import LoginPage from "./components/Home-section/Nav-layout/LoginPage";
import ForgetPassword from "./components/Home-section/Nav-layout/ForgetPassword";
import ResetPassword from "./components/Home-section/Nav-layout/ResetPassword";
import RegisterPage from "./components/Home-section/Nav-layout/RegisterPage";
import Error from "./components/Home-section/Nav-layout/Error";
import PrivateRoute from "./components/authorization-authenticate-section/PrivateRoute";
import PublicRoute from "./components/authorization-authenticate-section/PublicRoute";
import Email from "./components/Email-section/Email";
import Dashboard from './components/Home-section/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute restricted={false} exact path="/login" component={LoginPage} />
        <PublicRoute restricted={false} exact path="/room/:roomID" component={Room} />
        <PublicRoute restricted={false} exact path="/error" component={Error} />
        <PublicRoute restricted={false} exact path="/forgot-password" component={ForgetPassword} />
        <PublicRoute restricted={false} exact path='/reset-password/:email/:resettoken' component={ResetPassword}/>
        <PublicRoute restricted ={true} exact path="/register" component={RegisterPage} />
        <PrivateRoute exact path="/" component={CreateRoom} /> 
        <PrivateRoute exact path="/email" component={Email} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
