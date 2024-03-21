import React, { useState, useEffect } from "react";
import auth from "../lib/auth-helper";
import Signup from "../user/Signup";
import Signin from "../lib/Signin";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  Button,
  Paper,
  Snackbar,
} from "@material-ui/core";
import { add, getAll } from "../lib/api-task";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    margin: "auto",
    padding: "5px",
    marginTop: theme.spacing(5),
  }),
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

const initValues = {
  title: "",
  content: "",
  isTask: true,
  isTaskFinished: false,
  message: "",
};

export default function Home() {
  const [jwt, setJwt] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const classes = useStyles();
  const [isSignup, setIsSignup] = useState(true);
  const toggleSignupSignin = () => setIsSignup(!isSignup);
  const toggleDialog = () => setOpenDialog(!openDialog);
  const [notes, setNotes] = useState([]);
  const [values, setValues] = useState(initValues);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = JSON.parse(sessionStorage.getItem("jwt"));
    if (jwt) {
      setJwt(jwt);
      getAll(signal, { userId: jwt.user._id }).then((data) => {
        if (data && data.error) {
        } else {
          setNotes(data);
        }
      });
    }
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleAddTask = () => {
    const task = {
      title: values.title,
      content: values.content,
      isTask: values.isTask,
      isTaskFinished: values.isTaskFinished,
    };
    const authData = {
      userId: jwt.user._id,
      jwtToken: jwt.token,
    };
    add(task, authData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, message: data.message });
      }
      console.log(values);
      setOpenSnackbar(true);
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={values.message}
      />
      {!auth.isAuthenticated() ? (
        isSignup ? (
          <Signup toggleSignupSignin={toggleSignupSignin} />
        ) : (
          <Signin toggleSignupSignin={toggleSignupSignin} />
        )
      ) : (
        <>
          <Dialog open={openDialog} onClose={toggleDialog}>
            <DialogTitle>Add Task</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                className={classes.textField}
                value={values.title}
                onChange={handleChange("title")}
              />
              <TextField
                label="Content"
                className={classes.textField}
                value={values.content}
                onChange={handleChange("content")}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTask}
              >
                Add
              </Button>
            </DialogContent>
          </Dialog>
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            marginTop="30px"
            flexDirection="column"
          >
            <Typography variant="h3">TODO LIST</Typography>
            <Box width="600px" marginTop="30px">
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDialog}
              >
                Add Task
              </Button>
              {notes.slice(0, 5).map((data, index) => {
                return (
                  <Paper className={classes.root} elevation={4} key={index}>
                    <Typography>Title: {data.title}</Typography>
                    <Typography>Content: {data.content}</Typography>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
