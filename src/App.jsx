import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FormEditor from "./components/FormEditor";
import FormFill from "./components/FormFill";
import FormResponses from "./components/FormResponses";
import Home from "./components/Home";

const App = () => {
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('token')){
            setStatus(true);
        } else {
            setStatus(false);
        }
    }, [status]);
    
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        setStatus(false);
        window.location.href = '/'; // Navigate to the login page
    };

    return (
        <Router>
            {/* Navigation Bar - using your design */}
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container">
                    <Link className="navbar-brand" to={status ? "/dashboard" : '/'}>
                        <i className="fas fa-microphone-alt"></i> Beyond QWERTY
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav" >
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link " to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#features">Features</a>
                            </li>
                            {status && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">My Forms</Link>
                                </li>
                            )}
                            {!status ? (
                                <>
                                    <li className="nav-item" id="loginNavItem">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item" id="signupNavItem">
                                        <Link className="nav-link" to="/signup">Sign Up</Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item" id="logoutNavItem">
                                    <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setStatus={setStatus}/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/form/:id" element={<FormEditor />} />
                <Route path="/fill-form/:id" element={<FormFill />} />
                <Route path="/responses/:id" element={<FormResponses />} />
            </Routes>
        </Router>
    );
};

export default App;