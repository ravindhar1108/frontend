import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMicrophone, FaRobot } from "react-icons/fa";
import { startRecording, stopRecording } from "../utils/speechToText";

const FormFill = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [errors, setErrors] = useState({});
    const [listening, setListening] = useState({});
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/fill-form/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setForm(response.data);
                
                const initialResponses = response.data.fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
                const initialListening = response.data.fields.reduce((acc, field) => ({ ...acc, [field.name]: false }), {});
                setResponses(initialResponses);
                setListening(initialListening);
            } catch (err) {
                console.error("Error fetching form:", err);
            }
        };

        fetchForm();
    }, [id]);

    const autoCorrectValue = (value, type) => {
        value = value.trim(); // Remove unnecessary spaces
    
        if (type === "email") {
            value=value.toLowerCase();
            value = value.replace(/\s+/g, ""); // Remove spaces within email
            value = value.replace(/gmailcom$/i, "gmail.com"); // Fix "gmailcom" typo
    
            // Ensure there is exactly one '@'
            if (!value.includes("@")) {
                value += "@gmail.com";
            } else {
                let [local, domain] = value.split("@");
    
                // If domain is missing or incorrect, replace it with "gmail.com"
                if (!domain || !domain.includes(".")) {
                    domain = "gmail.com";
                } else {
                    // Ensure the domain has at least one dot and a valid ending
                    domain = domain.replace(/(\.[^.]+)?$/, ".com");
                }
    
                value = `${local}@${domain}`;
            }
        } else if (type === "number" || type === "tel") {
            value = value.replace(/[^0-9]/g, ""); // Keep only numbers
        } else if (type === "date") {
            // Remove any non-numeric characters (including extra hyphens)
            value = value.replace(/[^0-9]/g, "");
    
            // Ensure the correct length after cleaning
            if (value.length !== 8) return "Invalid Date";
    
            // Extract day, month, and year
            let day = value.substring(0, 2);
            let month = value.substring(2, 4);
            let year = value.substring(4, 8);
    
            return `${year}-${month}-${day}`;
        } else if (type === "text") {
            value = value.replace(/([a-z])([A-Z])/g, "$1 $2");
            value = value.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
            value = value.replace(/\b(Iam|mynameis|myself|from|in|at|of|to|with|and|but|so|because)\b/gi, " $1 ");
            value = value.replace(/\bIam\b/gi, "I am");
            value = value.replace(/\bMynameis\b/gi, "My name is");
            value = value.replace(/\bMyself\b/gi, "Myself,");
            value = value.replace(/,\s*/g, ", ");
            value = value.replace(/\.\s*/g, ". ");
            value = value.replace(/\s+/g, " ");
            value = value.charAt(0).toUpperCase() + value.slice(1);
            if (!/[.!?]$/.test(value)) {
                value += ".";
            }
        }
    
        return value;
    };
    
    const validateField = (value, type) => {
        let error = "";
        if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Invalid email address";
        } else if (type === "number" && isNaN(value)) {
            error = "Must be a number";
        } else if (type === "text" && value.trim() === "") {
            error = "This field is required";
        } else if (type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            error = "Invalid date format (YYYY-MM-DD)";
        } else if (type === "tel" && !/^\d{10}$/.test(value)) {
            error = "Invalid phone number (must be 10 digits)";
        }
        return error;
    };

    const handleChange = (fieldName, value, type) => {
        setResponses((prev) => ({ ...prev, [fieldName]: value }));
        setErrors((prev) => ({ ...prev, [fieldName]: validateField(value, type) }));
    };

    const handleVoiceInput = async (fieldName, fieldType) => {
        if (!listening[fieldName]) {
            const recorder = await startRecording((text) => {
                const correctedValue = autoCorrectValue(text, fieldType);
                setResponses((prev) => ({ ...prev, [fieldName]: correctedValue }));
            }, (isListening) => {
                setListening((prev) => ({ ...prev, [fieldName]: isListening }));
            }, fieldName);

            setMediaRecorder(recorder);
        } else {
            stopRecording(mediaRecorder);
            setListening((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async () => {
        const allFieldsValid = form.fields.every((field) => {
            const error = validateField(responses[field.name], field.type);
            if (error) setErrors((prev) => ({ ...prev, [field.name]: error }));
            return !error;
        });

        if (!allFieldsValid) {
            alert("Please fill out all fields correctly.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const formName = form.form_name;
            const { aiInput, ...filteredResponses } = responses;

            await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/submit`, {
                formName,
                responses: filteredResponses,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Form submitted successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleFillWithAI = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}/askgemini`,
                {
                    userInput: await responses.aiInput,
                    fields: form.fields,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const aiResponses = response.data.extractedData;
            
            // Ensure aiResponses is an object before proceeding
            if (typeof aiResponses !== "object" || aiResponses === null) {
                console.error("Unexpected AI response format:", aiResponses);
                alert("Unexpected AI response format. Please try again.");
                return;
            }
            
            // Map AI response to the correct form fields, skipping missing fields
            setResponses((prev) => {
                const updatedResponses = { ...prev };
                form.fields.forEach((field) => {
                    Object.keys(aiResponses).forEach((aiKey) => {
                        if (
                            field.name.toLowerCase().replace(/\s+/g, "") ===
                            aiKey.toLowerCase().replace(/\s+/g, "")
                        ) {
                            updatedResponses[field.name] = aiResponses[aiKey];
                        }
                    });
                });
                return updatedResponses;
            });
        } catch (error) {
            console.error("Error with AI fill:", error);
            alert("Failed to fill form with AI.");
        }
    };

    if (!form) return <p className="text-center text-gray-500">Loading form...</p>;

    return (
        <div className="auth-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="auth-card">
                            <h3>{form.form_name}</h3>
                            
                            {/* AI Input Section */}
                            <div className="mb-4 p-3 border border-gray-300 rounded">
                                <div className="mb-3">
                                    <label className="form-label">Voice to Form</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            value={responses.aiInput || ""}
                                            placeholder="Say the following details required to fill the form"
                                            onChange={(e) => handleChange("aiInput", e.target.value, "text")}
                                            className="form-control"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleVoiceInput("aiInput", "text")}
                                            className={`btn ${listening["aiInput"] ? "btn-danger" : "btn-outline-secondary"}`}
                                        >
                                            <FaMicrophone />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleFillWithAI}
                                    className="btn btn-primary w-100 mt-3"
                                >
                                    <FaRobot className="me-2 "/> Fill with AI
                                </button>
                            </div>
                            
                            {/* Form Fields */}
                            {form.fields.map((field, index) => (
                                <div key={index} className="mb-3">
                                    <label className="form-label">{field.name}</label>
                                    <div className="input-group">
                                        <input
                                            type={field.type}
                                            value={responses[field.name] || ""}
                                            onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                                            className="form-control"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleVoiceInput(field.name, field.type)}
                                            className={`btn ${listening[field.name] ? "btn-danger" : "btn-outline-secondary"}`}
                                        >
                                            <FaMicrophone />
                                        </button>
                                    </div>
                                    {errors[field.name] && <div className="text-danger small mt-1">{errors[field.name]}</div>}
                                </div>
                            ))}

                            <button 
                                onClick={handleSubmit} 
                                className="btn btn-primary w-100 mt-3"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormFill;