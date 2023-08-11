import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import LogOut from './Logout';
import { auth } from "./Firebase"

import { Link } from "react-router-dom";
export default function NavAuthentication() {
    const [user, setUser] = useState("");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            //const uid = user.uid;
            console.log("Signed in!")
            setUser(user)
            // ...
        } else {
            setUser("")
            console.log("Not signed in!")

        }
    });

    useEffect(() => {
        console.log("User changed")
    }, [user])

    if (user !== "") {
        return (<LogOut />)
    } else {
        return (<Link to="/authentication" className="navigationItem"> Login</Link>)
    }

}