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
} from "@material-ui/core";
import { add } from "../lib/api-task";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

export default function Home() {
  const [jwt, setJwt] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const [isSignup, setIsSignup] = useState(true);
  const toggleSignupSignin = () => setIsSignup(!isSignup);
  const toggleDialog = () => setOpenDialog(!openDialog);
  const [values, setValues] = useState({
    title: "",
    content: "",
    isTask: true,
    isTaskFinished: false,
    message: "",
  });

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
    });
  };

  useEffect(() => {
    setJwt(JSON.parse(sessionStorage.getItem("jwt")));
  }, []);

  return (
    <>
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
              <br />
              {values.message && (
                <Typography component="p" color="primary">
                  {values.message}
                </Typography>
              )}
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
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
