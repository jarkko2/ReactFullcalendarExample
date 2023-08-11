import { GetRolesFromFirebase } from './Firebase'
import { GetEventsFromFirebase } from './Firebase';

import { auth } from './Firebase'
import { useSelector } from 'react-redux'

import { Button } from "@mui/material";

function LogOut() {
  // Fetch datas when logged in
  GetRolesFromFirebase()
  GetEventsFromFirebase()

  const roleFromRedux = useSelector((state) => state.role)

  const logOut = () => {
    auth.signOut()

    // Reload page
    window.location.reload(false);
  }

  return (
    <div>
      <div className="navigationItem">
        {auth.currentUser.email}
      </div>
      <div className="navigationItem">
        {roleFromRedux}
      </div>
      <div className="navigationItem">
        <Button variant="contained" onClick={logOut} color="error">Logout</Button>
      </div>
    </div>
  )
}

export default LogOut