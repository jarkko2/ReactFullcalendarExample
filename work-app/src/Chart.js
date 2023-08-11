import { Chart } from 'react-charts'
import { useState } from 'react';
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { auth } from './Firebase';
import { Button } from "@mui/material";

export default function ChartView() {
    const eventsFromRedux = useSelector((state) => state.events)
    const roleFromRedux = useSelector((state) => state.role)
    // Get current date
    const curr = new Date();
    console.log("Curr date")
    console.log(curr)
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    const firstDayOfMonth = new Date(new Date(curr.getFullYear(), curr.getMonth(), 1).setHours(0, 0, 0))
    // last day will be next month but with 0 it will return current month last day
    const lastDayOfMonth = new Date(new Date(curr.getFullYear(), curr.getMonth() + 1, 0).setHours(23, 59, 59))

    var firstday = new Date(new Date(curr.setDate(first)).setHours(0, 0, 0));
    var lastday = new Date(new Date(curr.setDate(last)).setHours(23, 59, 59));

    const formattedToday = FormatDateToString(new Date())
    const formattedFirstday = FormatDateToString(firstday)

    // check month change only on last day
    const formattedLastday = FormatDateToString(lastday, lastday < firstday)

    const formattedFirstdayMonth = FormatDateToString(firstDayOfMonth)
    const formattedLastdayMonth = FormatDateToString(lastDayOfMonth)

    // Set range start to current week start, if current date is 14.10.2022 and day is 4 (friday), then week start is 10.10
    // Get day goes from 0 - 6
    const [startDate, setStartDate] = useState(formattedFirstday)
    // End date will be 10.10. + 6 days => 16.10.
    const [endDate, setEndDate] = useState(formattedLastday)

    const handleStartDate = (start) => {
        setStartDate(start)
    }
    const handleEndDate = (end) => {
        setEndDate(end)
    }

    const handleSetToday = () => {
        console.log("Setting today")
        console.log(formattedToday)
        setStartDate(formattedToday)
        setEndDate(formattedToday)
    }

    const handleSetThisWeek = () => {
        console.log("Setting this week")
        console.log(formattedLastday)
        setStartDate(formattedFirstday)
        setEndDate(formattedLastday)
    }

    const handleSetThisMonth = () => {
        console.log("Setting this month")
        console.log(firstDayOfMonth)
        console.log(lastDayOfMonth)
        setStartDate(formattedFirstdayMonth)
        setEndDate(formattedLastdayMonth)
    }


    console.log("Events from redux in chart")
    console.log(eventsFromRedux)

    // Format to use range 00:00 - 23:59, searching with same date will function
    var startDateFormatted = new Date(startDate).setHours(0, 0, 0)
    var endDateFormatted = new Date(endDate).setHours(23, 59, 59)

    console.log("Current dates")
    console.log(new Date(startDateFormatted))
    console.log(new Date(endDateFormatted))

    var users = new Object();
    eventsFromRedux.map((event) => {
        // If user not in the list
        if (!(event.user in users)) {
            if (event.start > new Date(startDateFormatted) && event.start < new Date(endDateFormatted)) {
                users[event.user] = (event.end - event.start) / (1000 * 60 * 60)
            }
            // if user already in list
        } else {
            if (event.start > new Date(startDateFormatted) && event.start < new Date(endDateFormatted)) {
                users[event.user] = users[event.user] + (event.end - event.start) / (1000 * 60 * 60)
            }
        }
    }
    );
    const formatted = []

    console.log("User role")
    console.log(roleFromRedux)

    for (const [key, value] of Object.entries(users)) {
        // If role is not admin, add only own data
        if (roleFromRedux !== "admin") {
            if (key === auth.currentUser.email) {
                formatted.push({
                    user: key,
                    hours: value
                })
            }
            continue
        }
        // else add everything
        formatted.push({
            user: key,
            hours: value
        })
    }


    console.log("Different users")
    console.log(formatted)

    // Prevent rendering the chart if no data was found
    if (formatted.length === 0) {
        return (
            <div className="CustomChart">
                <ChartNavigation
                    handleStartDate={handleStartDate}
                    handleEndDate={handleEndDate}
                    handleSetToday={handleSetToday}
                    handleSetThisWeek={handleSetThisWeek}
                    handleSetThisMonth={handleSetThisMonth}
                    startDate={startDate}
                    endDate={endDate}
                />
                <p>No data between range!</p>
            </div>
        )
    } else {
        return (
            <div className="CustomChart">
                <ChartNavigation
                    handleStartDate={handleStartDate}
                    handleEndDate={handleEndDate}
                    handleSetToday={handleSetToday}
                    handleSetThisWeek={handleSetThisWeek}
                    handleSetThisMonth={handleSetThisMonth}
                    startDate={startDate}
                    endDate={endDate}
                />
                <CustomChart data={formatted} />
            </div>
        )
    }

}

function ChartNavigation(props) {
    return (
        <div className="chartNav">
            <input type="date" onChange={(e) => props.handleStartDate(e.target.value)} value={props.startDate} ></input>
            <input type="date" onChange={(e) => props.handleEndDate(e.target.value)} value={props.endDate} classname="datePicker"></input>
            <Button variant="outlined" onClick={props.handleSetToday} className="customButton">Today</Button>
            <Button variant="outlined" onClick={props.handleSetThisWeek} className="customButton">This week</Button>
            <Button variant="outlined" onClick={props.handleSetThisMonth} className="customButton">This month</Button>
        </div>
    )
}

function FormatDateToString(date, monthChange = false) {
    // Check if month have changed
    if (monthChange) {
        return new Date(date).getFullYear() + "-" + ("0" + (new Date(date).getMonth() + 2)).slice(-2) + "-" + ("0" + new Date(date).getDate()).slice(-2)
    }
    return new Date(date).getFullYear() + "-" + ("0" + (new Date(date).getMonth() + 1)).slice(-2) + "-" + ("0" + new Date(date).getDate()).slice(-2)
}

function CustomChart(props) {
    const data = [
        {
            label: 'Hours',
            data: props.data,
            series: 1,

        },
    ]

    const primaryAxis = useMemo(
        (): AxisOptions<MyDatum> => ({
            position: "bottom",
            getValue: datum => datum.user,
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<MyDatum>[] => [
            {
                position: "left",
                getValue: datum => datum.hours,
                min: 0,
                max: 40,
                stacked: true
            },
        ],
        []
    )

    return (
        <Chart
            options={{
                data,
                primaryAxis,
                secondaryAxes,
            }}
        />
    )
}
