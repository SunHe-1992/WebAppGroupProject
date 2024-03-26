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
  Checkbox,
  Input,
} from "@material-ui/core";
import { add, getAll, update, remove } from "../lib/api-task";

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
  noteId: 0
};

export default function Home() {
  const [jwt, setJwt] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditWindow, setOpenEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const classes = useStyles();
  const [isSignup, setIsSignup] = useState(true);
  const toggleSignupSignin = () => setIsSignup(!isSignup);
  const toggleDialog = () => setOpenDialog(!openDialog);
  const toggleEditWindow = () => setOpenEdit(!openEditWindow);
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
        setValues({ ...values, message: data.message, title: "", content: "" });
      }
      setOpenSnackbar(true);
    });
  };

  const handleEditChange = (name) => (event) => {
    // console.log(" handleEditChange name =" + name)
    // console.log(" handleEditChange event.target.value =" + event.target.value)
    setValues({ ...values, [name]: event.target.value });
  };
  const handleEditCheckChange = () => (event) => {
    setValues({ ...values, ["isTaskFinished"]: event.target.checked });
  };
  const handleEditTask = () => {
    const task = {
      title: values.title,
      content: values.content,
      isTask: values.isTask,
      isTaskFinished: values.isTaskFinished,
    };
    console.log("note id is " + initValues.noteId)
    console.log("note task " + JSON.stringify(task))
    const authData = {
      userId: jwt.user._id,
      jwtToken: jwt.token,
      noteId: initValues.noteId,
    };
    update(task, authData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, message: data.message, title: "", content: "" });
      }
      setOpenSnackbar(true);
    });
    toggleEditWindow()
    window.location.reload();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };


  //edit button function
  function handleEditClick(data) {
    initValues.title = data.title
    initValues.content = data.content
    initValues.isTaskFinished = data.isTaskFinished
    initValues.noteId = data._id
    setOpenEdit(!openEditWindow)
  }

  function handleRemoveClick(data) {
    initValues.noteId = data._id
    console.log("note id is " + initValues.noteId)
    const task = {
      title: values.title,
      content: values.content,
      isTask: values.isTask,
      isTaskFinished: values.isTaskFinished,
    };
    const authData = {
      userId: jwt.user._id,
      jwtToken: jwt.token,
      noteId: initValues.noteId,
    };
    remove(task, authData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, message: data.message, title: "", content: "" });
      }
      setOpenSnackbar(true);
    });
    window.location.reload();
  }
  return (
    <>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={values.message}
      />
      <Box display="flex" flexDirection="row" alignItems="center">
        {!auth.isAuthenticated() && (
          <Box maxWidth="600px" textAlign="center">
            <Typography variant="h2">
              Organize your work and life, finally.
            </Typography>
            <br />
            <Typography variant="h6">
              Become focused, organized, and calm. The world’s #1 to-do list
              app.
            </Typography>
          </Box>
        )}

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
            <Dialog open={openEditWindow} onClose={toggleEditWindow}>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogContent>
                <Checkbox
                  label="Finished"
                  // className={classes.Checkbox}
                  checked={values.isTaskFinished}
                  onChange={handleEditCheckChange()}
                ></Checkbox>
                <Input
                  label="Title"
                  className={classes.textField}
                  value={values.title}
                  onChange={handleEditChange("title")}
                />
                <Input
                  label="Content"
                  className={classes.textField}
                  value={values.content}
                  onChange={handleEditChange("content")}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditTask}
                >
                  Save
                </Button>
              </DialogContent>
            </Dialog>

            <Box
              justifyContent="center"
              alignItems="center"
              display="flex"
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
                      <Checkbox checked={data.isTaskFinished}></Checkbox>
                      <Typography>Title: {data.title}</Typography>
                      <Typography>Content: {data.content}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        data={data.title}
                        onClick={() => handleEditClick(data)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        data={data.title}
                        onClick={() => handleRemoveClick(data)}
                      >
                        Remove
                      </Button>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
