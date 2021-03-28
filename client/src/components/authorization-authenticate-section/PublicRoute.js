import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from ".";

const PublicRoute = ({ component: Component,restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && restricted ? (
            <Redirect to= "/dashboard"/>
          
        ) : (
            <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
