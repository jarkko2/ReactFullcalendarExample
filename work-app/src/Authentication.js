import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { auth } from './Firebase'
import axios from 'axios'
// Material UI 
import { TextField, Button, Typography, Alert } from "@mui/material";

function AuthenticationView() {
  //const auth = getAuth();
  const [username, HandleUserName] = useState("")
  const [password, HandlePassword] = useState("")

  const [errorMessage, HandleErrorMessage] = useState(true)
  const [successMessage, HandleSuccessMessage] = useState(true)
  const [message, HandleMessage] = useState("Something went wrong")

  const TryLogin = () => {
    // Handle username or password empty
    if (username === "" || password === "") {
      console.log("Username or password empty")
      HandleErrorMessage(false)
      HandleSuccessMessage(true)
      HandleMessage("Username or password empty")
    }
    // Handle login
    else {
      console.log("Attempting to login with " + username)
      signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          HandleErrorMessage(true)
          HandleSuccessMessage(false)
          HandleMessage("Login success")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          HandleErrorMessage(false)
          HandleSuccessMessage(true)
          HandleMessage("Wrong user or password")
        });

    }

  }

  const TryRegister = () => {
    // Handle username or password empty
    if (username === "" || password === "") {
      console.log("Username or password empty")
      HandleErrorMessage(false)
      HandleSuccessMessage(true)
      HandleMessage("Username or password empty")
    }
    // Try register
    else {
      HandleErrorMessage(true)
      HandleSuccessMessage(false)
      HandleMessage("Register success")
      console.log("Attempting to register with " + username)
      createUserWithEmailAndPassword(auth, username, password)
      registerToChatEngine()
      addToDefaultWorkChat()
    }
  }
  const registerToChatEngine = async () => {
    const GLOBAL_USER_SECRET = process.env.REACT_APP_CHATENGINE_GLOBAL_USER_SECRET;
    const private_key = process.env.CHAT_PRIVATE_KEY
    var data = {
      "username": username,
      "secret": GLOBAL_USER_SECRET
    }

    var config = {
      method: 'post',
      url: 'https://api.chatengine.io/users/',
      headers: {
        'PRIVATE-KEY': private_key
      },
      data: data
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  const addToDefaultWorkChat = async () => {
    const project_id = process.env.REACT_APP_CHATENGINE_CHAT_PRIVATE_KEY
    const GLOBAL_USER_SECRET = process.env.REACT_APP_CHATENGINE_GLOBAL_USER_SECRET;
    const CHAT_ADMIN_EMAIL = process.env.REACT_APP_CHATENGINE_CHAT_ADMIN_EMAIL;
    var data = {
      "username": username
    }

    var config = {
      method: 'post',
      url: 'https://api.chatengine.io/chats/[ID HERE]]/people/',
      headers: {
        'Project-ID': project_id,
        'User-Name': CHAT_ADMIN_EMAIL,
        'User-Secret': GLOBAL_USER_SECRET
      },
      data: data
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  return (
    <div className="authentication">

      <Typography variant="h4">Login</Typography>
      <form>
        <div className="authenticationItem">
          <TextField id="name" label="Email" variant="standard" onChange={(e) => HandleUserName(e.target.value)} />
        </div>
        <div className="authenticationItem">
          <TextField id="password" label="Password" variant="standard" type="password" onChange={(e) => HandlePassword(e.target.value)} />
        </div>
        <div className="authenticationItem">
          <Button variant="outlined" onClick={TryLogin}>Login</Button>
        </div>
      </form>
      <div className="authenticationItem">
        <Typography variant="subtitle1">Don't have an account? Register down below</Typography>
      </div>
      <form>
        <div className="authenticationItem">
          <TextField id="name" label="Email" variant="standard" onChange={(e) => HandleUserName(e.target.value)} />
        </div>
        <div className="authenticationItem">
          <TextField id="password" label="Password" variant="standard" type="password" onChange={(e) => HandlePassword(e.target.value)} />
        </div>
        <div className="authenticationItem">
          <Button variant="outlined" onClick={TryRegister}>Register</Button>
        </div>
      </form>
      <div className={errorMessage ? 'hidden' : undefined}>
        <Alert severity="error">{message}</Alert>
      </div>
      <div className={successMessage ? 'hidden' : undefined}>
        <Alert severity="success">{message}</Alert>
      </div>
    </div>
  )
}


export default AuthenticationView;  