import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
} from "@material-ui/core";
import auth from "../lib/auth-helper";
import { Link, useLocation } from "react-router-dom";
import logo from "./../assets/images/logo.png";

const isActive = (location, path) => {
  return location.pathname === path
    ? { color: "#ff4081" }
    : { color: "#ffffff" };
};

export default function Menu() {
  const location = useLocation();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/">
            <Avatar src={logo} />
          </Link>
          <Typography variant="h6">Todo App</Typography>
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
                  auth.clearJWT(() => window.location.reload());
                }}
              >
                Sign out
              </Button>
            </span>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
