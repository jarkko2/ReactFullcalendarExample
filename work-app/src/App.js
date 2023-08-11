import './App.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { eventsReducer } from './Reducer';
import NavAuthentication from './NavAuthentication'
import { Outlet, Link, useNavigate } from "react-router-dom";

export const store = createStore(eventsReducer)

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">

        </header>
        <nav>
          <div className="navBar">
            <div className="navBarLeft">
              <Link to="/chart" className="navigationItem">Chart</Link>
              <Link to="/calendar" className="navigationItem">Calendar</Link>
              <Link to="/chat" className="navigationItem">Chat</Link>
            </div>
            <div className="navBarRight">
              <NavAuthentication />
            </div>
          </div>
        </nav>
        <Outlet />
      </div>
    </Provider>
  );
}




export default App;
