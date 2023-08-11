import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import Calendar from "./routes/calendar";
import Chart from "./routes/chart";
import Authentication from "./routes/authentication";
import Chat from "./routes/chat";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Do not use strict mode since it will call firebase two times
  //<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="calendar" element={<Calendar />} />
        <Route path="chart" element={<Chart />} />
        <Route path="authentication" element={<Authentication />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
