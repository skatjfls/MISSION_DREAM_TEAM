import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< Updated upstream
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
=======
<<<<<<< HEAD
import './index.css';
import App from './App';
=======
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
>>>>>>> nimo
>>>>>>> Stashed changes
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< Updated upstream
    <BrowserRouter>
    <App />
    </BrowserRouter>
=======
<<<<<<< HEAD
    <App />
=======
    <BrowserRouter>
    <App />
    </BrowserRouter>
>>>>>>> nimo
>>>>>>> Stashed changes
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
