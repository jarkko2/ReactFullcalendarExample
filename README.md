# React FullCalendar 
---

This is an example of how to implement fullCalendar on React and storing data to Firebase

[![Video](https://img.youtube.com/vi/oRH_7dF1bZI/0.jpg)](https://www.youtube.com/watch?v=oRH_7dF1bZI)

# Installing
1. Clone the project
2. Run "npm install"
3. Run "npm start"
4. Set up Firebase project, you will need Firestore Database and Authentication *
5. Paste config values to .env (see env_variables for base)
6. Set up Chatengine project https://chatengine.io/
7. Paste credentials to .env
8. Create user in app, if you see "Register success", you are all done

*More detailed Firebase initialization
1. Go to firebase console
2. Create new project
3. Allow or don't allow analytics (does not matter, not used in project)
4. Click add web app
5. Set up name, Firebase Hosting is not needed
6. Click register app
7. Now you will receive authentication configs, copy the snippet
8. Paste the firebaseConfig to Firebase.js or set the variables to .env file
9. Click continue to console
10. Click Build -> Firestore Database
11. Click create database
12. Start in test mode
13. Use whatever location you want and click enable
14. Set up rules (see below) if you want to enable authentication requests
15. Click Build -> Authentication
16. Click Get started
17. Click Email/Password
18. Click Email/Password again, Email link is not needed, click save
19. Start up the app with "npm start"
20. Click login
21. Register with whatever user, for example "test@test.com / asd123"
22. When you see "Register success", you are all done

## Firestore Database rules
```
 rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth.uid != null;
        }
      }
    }
```

# Adding admin account
1. Search UserUID from Firebase Authentication
2. Go to Firebase Database
3. Create new collection "roles", most likely auto generated already
4. Add new document inside roles, use auto ID
5. Add two new fields, role: "admin" and userUid: [Authentication UserUid here]
6. Refresh app, employee status should now change to admin

# Final documentation   

## UI 

![Calendar week view](/images/Calendar.png)   

![Calendar month view](/images/Calendar2.png)   

![Chart view](/images/Chart.png)   

![Chat view](/images/Chat.png)   

## Features implemented
#### Calendar features
* Add event
* Delete event (if user owns it)
* Modify event (drag & drop & resize)
* Repeating event  (admin only)
* User roles, only admin can see everyones events
* Prevent user from creating event overlapping repeating event
* Colors based on ownership of event

#### Chart features
* Show user work hours based on time range
* "Today/This week/This month" buttons
* Admin can see everyones working hours

#### Chat features
* Register to chat engine at the same time as in Firebase
* Add to work chat automatically

#### Other libraries
* Redux (storing user role and events locally between views)
* Router (routing between calendar/chart/chat views)
* Firebase (authentication and storing events)
* Material UI (easy to implement professional looking visuals)

#### Known bugs / todos
* Rapid event drag and dropping can lead to duplicate events, refreshing page will fix
* Event changing does not check ownership, event editing is disabled on unowned events but it might not be safe
* By adding event to month view and moving it to another day, end time is set weirdly. Might be fixed if default event time is set for example to 1h
* ^ This does not happen if event is resized and has end time