import { auth } from "./Firebase"

export function eventsReducer(state = { events: [], role: "" }, action) {

  var splittedString = []
  if (action.event != null) {
    splittedString = action.event.title.split(',')
  }
  switch (action.type) {

    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events,
        {
          title: state.role === "admin" ? action.event.title : splittedString[0],
          id: action.event.id,
          date: action.event.date,
          startTime: action.event.startTime,
          endTime: action.event.endTime,
          daysOfWeek: action.event.daysOfWeek,
          user: action.event.user,
          start: action.event.start,
          end: action.event.end,
          editable: action.event.user === auth.currentUser.email,
          color: action.event.user === auth.currentUser.email ? "#3bb4f5" : "#17445c",
          // Prevent overlap to repeating events
          overlap: action.event.daysOfWeek === null || state.role === "admin"
        }]
      }
    case 'REMOVE_EVENT':
      console.log("attempting to remove event")
      console.log(action.event.id)

      const newEvents = state.events.filter(event => event.id !== action.event.id);
      console.log(newEvents)
      return {
        ...state,
        events: newEvents
      }
    case 'UPDATE_EVENT':
      console.log("attempting to update event")
      console.log(action.event)
      if (action.event._def.recurringDef) {
        console.log("This is repeating event")
        var startTimeHour = ("0" + action.event.start.getHours()).slice(-2) + ":" + ("0" + action.event.start.getMinutes()).slice(-2)
        var endTimeHour = ("0" + (action.event.end.getHours())).slice(-2) + ":" + ("0" + action.event.end.getMinutes()).slice(-2)
        var weekday = action.event.start.getDay().toString()
        const updatedEvents = state.events.map(event => {
          if (event.id === action.event.id) {
            return { ...event, startTime: startTimeHour, endTime: endTimeHour, daysOfWeek: weekday };
          }
          return event
        })
        // const updatedEvents = state.events;
        console.log(updatedEvents)
        return {
          ...state,
          events: updatedEvents
        }
      } else {
        const updatedEvents = state.events.map(event => {
          if (event.id === action.event.id) {
            return { ...event, start: action.event.start, end: action.event.end };
          }
          return event
        })
        // const updatedEvents = state.events;
        console.log(updatedEvents)
        return {
          ...state,
          events: updatedEvents
        }
      }
    case 'SET_USER_ROLE':
      console.log("attempting to set user role")
      console.log(action.role)
      return {
        ...state,
        role: action.role
      }
    default: return state;
  }
}