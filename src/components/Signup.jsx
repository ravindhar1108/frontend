import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { startRecording, stopRecording } from "../utils/speechToText";
import { FaMicrophone, FaEye, FaEyeSlash } from "react-icons/fa";



const Signup = ({ setStatus }) => {
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [listening, setListening] = useState({ username: false, email: false, password: false });
    const [recorders, setRecorders] = useState({ username: null, email: null, password: null });
    const [showPassword, setShowPassword] = useState(false);
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();

    const handleChange = (fieldName, value) => {
        setUser((prev) => ({ ...prev, [fieldName]: value }));
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, []);

    const autoCorrectValue = (value, type) => {
        value = value.trim(); // Remove unnecessary spaces

        if (type === "email") {
            // Ensure there is exactly one '@'
            value=value.toLowerCase();
            if (!value.includes("@")) {
                value += "@gmail.com"; // Default to Gmail if no domain is provided
            } else {
                let [local, domain] = value.split("@");

                // If domain is missing or malformed, default to "gmail.com"
                if (!domain || !domain.includes(".")) {
                    domain = "gmail.com";
                } else {
                    // Auto-correct common mistakes like "gmailcom", "yahoocom", etc.
                    domain = domain.replace(/(gmail|yahoo|outlook|hotmail|icloud|aol|protonmail|zoho|yandex)com$/i, "$1.com");
                }

                value = `${local}@${domain}`;
            }
        }

        return value;
    };

    const handleVoiceInput = async (fieldName) => {
        if (!listening[fieldName]) {
            const recorder = await startRecording((text) => {
                const correctedValue = autoCorrectValue(text, fieldName);
                setUser((prev) => ({ ...prev, [fieldName]: correctedValue }));
            }, (isListening) => {
                setListening((prev) => ({ ...prev, [fieldName]: isListening }));
            }, fieldName);

            setRecorders(recorder);
        } else {
            stopRecording(recorders);
            setListening((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/signup`, user);
            alert(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            alert(error.response.data.message || "Signup failed");
        }
    };

    return (
        <section className="auth-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="auth-card">
                            <h3>Create Account</h3>
                            {signupError && (
                                <div className="alert alert-danger" role="alert">
                                    {signupError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={user.username}
                                            onChange={(e) => handleChange("username", e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text"
                                            onClick={() => handleVoiceInput("username")}
                                        >
                                            <i className={`fas fa-microphone ${listening.username ? "text-danger" : ""}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={user.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text"
                                            onClick={() => handleVoiceInput("email")}
                                        >
                                            <i className={`fas fa-microphone ${listening.email ? "text-danger" : ""}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={user.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text"
                                            onClick={() => handleVoiceInput("password")}
                                        >
                                            <i className={`fas fa-microphone ${listening.password ? "text-danger" : ""}`}></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="input-group-text"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fas fa-${showPassword ? "eye" : "eye-slash"}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                                <div className="text-center mt-3">
                                    <p>Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;