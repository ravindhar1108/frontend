import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

const FormEditor = () => {
    const { id } = useParams();      
    const [formName, setFormName] = useState("");
    const [fields, setFields] = useState([]);
    const navigate = useNavigate();

    const addField = () => {
        setFields([...fields, { name: "", type: "text" }]);
    };

    const handleFieldChange = (index, key, value) => {
        setFields(fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)));
    };

    const deleteField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const isFormValid = () => {
        return formName.trim() !== "" && fields.length > 0 && fields.every(field => field.name.trim() !== "");
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not authenticated. Please log in.");
                return;
            }

            const formData = { id, formName, fields };
            await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/save-form`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Form saved successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving form:", error.response ? error.response.data : error);
            alert("Failed to save form. Check the console for details.");
        }
    };

    return (
        <div className="form-builder-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <div className="builder-sidebar">
                            <h3 className="text-center mb-4">Create Form</h3>
                            
                            <div className="form-group mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Form Name" 
                                    value={formName} 
                                    onChange={(e) => setFormName(e.target.value)} 
                                    className="form-control"
                                />
                            </div>

                            <div className="form-preview">
                                <div className="preview-header">
                                    <h3>Form Fields</h3>
                                </div>
                                <div className="preview-container">
                                    <div className="form-fields-container">
                                        {fields.map((field, index) => (
                                            <div key={index} className="field-item">
                                                <div className="field-actions">
                                                    <button 
                                                        onClick={() => deleteField(index)} 
                                                        className="btn btn-danger"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 mb-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Field Name" 
                                                            value={field.name} 
                                                            onChange={(e) => handleFieldChange(index, "name", e.target.value)} 
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <select 
                                                            value={field.type} 
                                                            onChange={(e) => handleFieldChange(index, "type", e.target.value)} 
                                                            className="form-control"
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="number">Number</option>
                                                            <option value="textarea">Textarea</option>
                                                            <option value="email">Email</option>
                                                            <option value="date">Date</option>
                                                            <option value="file">File Upload</option>
                                                            <option value="tel">Telephone</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="field-buttons mt-3">
                                <button 
                                    onClick={addField} 
                                    className="btn btn-primary w-100 mb-3"
                                >
                                    <FaPlus className="mr-2" /> Add Field
                                </button>

                                <button 
                                    onClick={handleSubmit} 
                                    disabled={!isFormValid()}
                                    className={`btn w-100 ${!isFormValid() ? 'btn-secondary' : 'btn-success'}`}
                                >
                                    Save Form
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEditor;