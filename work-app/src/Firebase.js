import { useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore/lite';

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const auth = getAuth();

const addEvent = event => ({ type: 'ADD_EVENT', event })

const removeEvent = event => ({ type: 'REMOVE_EVENT', event })

const updateEvent = event => ({ type: 'UPDATE_EVENT', event })

const setUserRole = role => ({ type: 'SET_USER_ROLE', role })


const GetRolesFromFirebase = async () => {
    const [role, setRole] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            var userRole = "employee"
            //const docRef = doc(db, 'roles', uid)
            const ruleCollection = collection(db, 'roles');
            const ruleSnapshot = await getDocs(ruleCollection)
            //console.log(ruleSnapshot)
            const userRoles = ruleSnapshot.docs.map(user => {
                return {
                    userUid: user.data().userUid,
                    role: user.data().role
                };
            });
            userRoles.map((user) => {
                if (auth.currentUser != null) {
                    if (user.userUid === auth.currentUser.uid) {
                        console.log("Found role " + user.role)
                        userRole = user.role
                    }
                }
            })
            setRole(userRole)
            dispatch(setUserRole(userRole))
        }
        // start loading data
        console.log("fetch data...")
        fetchData();

    }, []);
    return role
}

const GetEventsFromFirebase = () => {
    const [events, setItems] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            const eventCollection = collection(db, 'events');
            const eventSnapshot = await getDocs(eventCollection);

            const events = eventSnapshot.docs.map(doc => {
                // repeating event checks
                var starttime = new Date()
                var endtime = new Date()

                if (doc.data().end != null) {
                    endtime = doc.data().end.toDate()
                }
                if (doc.data().start != null) {
                    starttime = doc.data().start.toDate()
                }

                return {
                    title: doc.data().title,
                    id: doc.id,
                    startTime: doc.data().startTime,
                    endTime: doc.data().endTime,
                    daysOfWeek: doc.data().daysOfWeek,
                    user: doc.data().user,
                    start: starttime,
                    end: endtime
                };

            });
            setItems(events);
            events.map((event) => {
                let newItem = { title: event.title, date: event.date, id: event.id, startTime: event.startTime, endTime: event.endTime, daysOfWeek: event.daysOfWeek, user: event.user, start: event.start, end: event.end };
                dispatch(addEvent(newItem))
            })
            //dispatch(setEvents(events))
            console.log("fetch completed!")
            console.log(events)
        }
        // start loading data
        console.log("fetch data...")
        fetchData();
    }, []);
    return (events)
}

// Add event
const HandleSubmit = async (arg, currEmail, title, isRepeating, dispatch) => {
    console.log(currEmail)
    console.log("Date to be added")
    console.log(arg)

    var endDate = new Date(arg.date)
    let newItem
    // check if added in month view
    var eventDate = new Date(endDate);
    console.log("Adding in month view")
    if (eventDate.getHours() === 0) {
        console.log("Adding 8 hours to default time")
        endDate = new Date(eventDate.setTime(eventDate.getTime() + 8 * 60 * 60 * 1000))
    }
    const result = addHours(1, endDate);
    console.log(result)
    if (!isRepeating) {
        // Add new item to firebase
        newItem = { title: (title + "," + currEmail), start: endDate, user: currEmail, end: result };
        const docRef = await addDoc(collection(db, "events"), newItem);
        console.log("Non-repeating event")
        // Get document id for adding redux
        newItem = { title: (title + "," + currEmail), start: endDate, user: currEmail, end: result, id: docRef.id }
    } else {
        // Format start and end times to string
        var startTimeHour = ("0" + endDate.getHours()).slice(-2) + ":" + ("0" + endDate.getMinutes()).slice(-2)
        var endTimeHour = ("0" + (result.getHours() + 1)).slice(-2) + ":" + ("0" + result.getMinutes()).slice(-2)

        console.log("Repeating event")
        // Add new item to firebase
        newItem = { title: (title + "," + currEmail), startTime: startTimeHour, user: currEmail, endTime: endTimeHour, daysOfWeek: endDate.getDay().toString() };
        const docRef = await addDoc(collection(db, "events"), newItem);
        // Get document id for adding redux
        newItem = { title: (title + "," + currEmail), startTime: startTimeHour, user: currEmail, endTime: endTimeHour, id: docRef.id, daysOfWeek: endDate.getDay().toString() }

    }
    dispatch(addEvent(newItem))
}

function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
}

// Update event
const HandleUpdate = async (arg, currEmail, dispatch) => {
    console.log("New")
    console.log(arg.event._def.recurringDef)
    console.log(arg.event._instance.range.end)

    // Get document reference from Firebase
    const docRef = doc(db, 'events', arg.event._def.publicId)
    console.log(docRef)

    const offset = arg.event.start
    console.log("Starting time")
    console.log(offset)

    // repeating event
    if (arg.event._def.recurringDef) {
        console.log("This is repeating event")
        var startTimeHour = ("0" + arg.event.start.getHours()).slice(-2) + ":" + ("0" + arg.event.start.getMinutes()).slice(-2)
        var endTimeHour = ("0" + (arg.event.end.getHours())).slice(-2) + ":" + ("0" + arg.event.end.getMinutes()).slice(-2)
        var weekday = arg.event.start.getDay().toString()
        await updateDoc(docRef, {
            startTime: startTimeHour,
            endTime: endTimeHour,
            daysOfWeek: weekday
        }
        )
        dispatch(updateEvent(arg.event))
    } else {
        // Non-repeating event
        await updateDoc(docRef, {
            start: arg.event.start,
            end: arg.event.end,
        }
        )
        dispatch(updateEvent(arg.event))
    }

}

// Delete event
const HandleClick = async (arg, dispatch) => {
    const docRef = doc(db, 'events', arg.event._def.publicId)
    console.log(docRef)

    // Check for ownership
    if (arg.event._def.extendedProps.user !== auth.currentUser.email) {
        console.log("You don't own this event!")
        return false
    }

    arg.event.remove()
    dispatch(removeEvent(arg.event))
    await deleteDoc(docRef)
    return true
}
export { GetEventsFromFirebase, HandleSubmit, HandleUpdate, HandleClick, GetRolesFromFirebase };
