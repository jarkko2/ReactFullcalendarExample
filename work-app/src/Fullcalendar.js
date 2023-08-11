import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { HandleSubmit, HandleUpdate, HandleClick } from './Firebase'
import { useSelector, useDispatch } from 'react-redux'

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Checkbox } from '@mui/material';
import FormControlLabel from "@mui/material/FormControlLabel";
import { auth } from './Firebase'



export default function CustomCalendar() {
    // Variables for adding event
    const [title, setTitle] = useState("")
    const [event, setEvent] = useState({})

    // Redux variables
    let eventsFromRedux = useSelector((state) => state.events)
    const roleFromRedux = useSelector((state) => state.role)
    const dispatch = useDispatch()


    // Repeating event checkbox
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.currentTarget.checked);
    }
    ////////////

    // Add event popup
    const [open, setOpen] = useState(false);

    // Delete event popup
    const [openDelete, setOpenDelete] = useState(false);

    // Info popup
    const [openInfo, setOpenInfo] = useState(false);

    const handleClickOpen = (arg) => {
        // Open popup
        setOpen(true);
        console.log(arg)
        setEvent(arg)
        console.log(event)
    };

    // Close add popup
    const handleClose = () => {
        setOpen(false);
    };

    // Clode delete popup
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleCloseInfo = () => {
        setOpenInfo(false);
    };

    const handleAdd = () => {
        // Clicked ok on add popup
        console.log("Title is " + title)
        console.log("Checkbox status was " + checked)
        setTitle("")
        setOpen(false);
        HandleSubmit(event, auth.currentUser.email, title, checked, dispatch)
    };

    const handleDateClick = (arg) => {
        handleClickOpen(arg)
    }

    const handleEventChange = (arg) => {
        console.log("Event changed")
        HandleUpdate(arg, auth.currentUser.email, dispatch)
    }
    const handleEventClick = (arg) => {
        setOpenDelete(true)
        setEvent(arg)
    }
    const handleDelete = () => {
        HandleClick(event, dispatch).then(owned => {
            console.log("Event ownership: " + owned)
            if (owned != null && !owned){
                setOpenInfo(true)
            }
        })
        setEvent({})
        setOpenDelete(false)
    };

    // Days of week are repeating events which are forced to be shown
    if (roleFromRedux === "employee") {
        eventsFromRedux = eventsFromRedux.filter(event => event.user === auth.currentUser.email || (event.daysOfWeek != null))
    }
    console.log("Redux events")
    console.log(eventsFromRedux)
    return (
        <div className="FullCalendar">
            <FullCalendar
                headerToolbar={{
                    center: 'dayGridMonth,timeGridWeek,timeGridDay',
                    end: 'listWeek today prev,next'
                }}
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                events={eventsFromRedux}
                dateClick={handleDateClick}
                eventChange={handleEventChange}
                weekends={true}
                editable
                eventClick={handleEventClick}
                slotMinTime="06:00:00"
                slotMaxTime="18:00:00"
                height="750px"
                nowIndicator={true}
            />
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>New event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter event title
                        </DialogContentText>
                        <TextField
                            autoFocus={true}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <br></br>
                        <FormControlLabel
                            control={<Checkbox checked={checked} onChange={handleChange} />}
                            label="Repeating event"
                            disabled={roleFromRedux !== "admin"}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Delete event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete event?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                        <Button onClick={handleDelete}>Delete</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openInfo}>
                    <DialogTitle>Info</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You don't own this event!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfo}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
