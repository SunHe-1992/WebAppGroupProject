import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@material-ui/core";
import auth from "../lib/auth-helper";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./../assets/images/logo.png";

const isActive = (location, path) => {
  return location.pathname === path
    ? { color: "#ff4081" }
    : { color: "#ffffff" };
};

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <Avatar src={logo} />
        </Link>
        <Typography variant="h6">Todo App</Typography>
        <Link to="/users">
          <Button style={isActive(location, "/users")}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button
                style={isActive(
                  location,
                  "/user/" + auth.isAuthenticated().user._id
                )}
              >
                My Profile
              </Button>
            </Link>
            <Button
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
}
