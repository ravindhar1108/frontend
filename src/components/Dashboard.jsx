import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash, FaPencilAlt, FaEye } from "react-icons/fa";

const Dashboard = () => {
    const [forms, setForms] = useState([]);
    const [allForms, setAllForms] = useState([]);
    const [formCreators, setFormCreators] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setForms(response.data);
            } catch (err) {
                console.error("Error fetching forms:", err);
                setError("Failed to load forms. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchAllForms = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/all-forms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAllForms(response.data);
            } catch (err) {
                console.error("Error fetching all forms:", err);
                setError("Failed to load all forms. Please try again.");
            }
        };

        const fetchFormCreators = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/form-creators`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const creatorMap = {};
                response.data.forEach(user => {
                    creatorMap[user.id] = user.username;
                });

                setFormCreators(creatorMap);
            } catch (err) {
                console.error("Error fetching form creators:", err);
                setError("Failed to load form creators.");
            }
        };

        fetchForms();
        fetchAllForms();
        fetchFormCreators();
    }, []);

    const deleteForm = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not authenticated. Please log in.");
                return;
            }

            await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setForms(forms.filter(form => form.form_id !== id));
        } catch (err) {
            console.error("Error deleting form:", err);
            setError("Failed to delete form. Please try again.");
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const createNewForm = async () => {
        const newFormId = crypto.randomUUID();
        navigate(`/form/${newFormId}`);
    };

    return (
        <div className="my-forms-section">
            <div className="container">
                <div className="section-header">
                    <h2>Your Forms</h2>
                </div>

                <div className="my-4 text-right">
                    <button 
                        onClick={createNewForm} 
                        className="btn btn-primary"
                    >
                        <FaPlus className="mr-2 inline-block" /> Create New Form
                    </button>
                </div>

                <div className="forms-container">
                    {forms.length === 0 ? (
                        <div className="form-card empty-card text-center">
                            <div className="add-form-icon">
                                <FaPlus />
                            </div>
                            <p className="text-gray-500">No forms found. Create your first form!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {forms.map((form) => (
                                <div key={form.form_id} className="form-card">
                                    <div className="form-meta">
                                        <span>{new Date(form.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h4>{form.form_name}</h4>
                                    <div className="form-actions">
                                        <div className="btn-group flex space-x-2">
                                            <button 
                                                onClick={() => navigate(`/fill-form/${form.form_id}`)} 
                                                className="btn btn-primary flex-1"
                                            >
                                                <FaPencilAlt className="mr-2" /> Fill
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/responses/${form.form_id}`)} 
                                                className="btn btn-primary flex-1"
                                            >
                                                <FaEye className="mr-2" /> Responses
                                            </button>
                                            <button 
                                                onClick={() => deleteForm(form.form_id)} 
                                                className="btn btn-danger"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="section-header mt-8">
                    <h2>Other Forms</h2>
                </div>

                <div className="forms-container">
                    {allForms.length === 0 ? (
                        <div className="form-card empty-card text-center">
                            <p className="text-gray-500">No additional forms available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allForms.map((form) => (
                                <div key={form.form_id} className="form-card">
                                    <div className="form-meta">
                                        <span>{new Date(form.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h4>{form.form_name}</h4>
                                    <p className="text-gray-500 mb-3">
                                        Created by: {formCreators[form.username] || "Unknown"}
                                    </p>
                                    <div className="form-actions">
                                        <button
                                            onClick={() => navigate(`/fill-form/${form.form_id}`)}
                                            className="btn btn-primary w-full"
                                        >
                                            <FaPencilAlt className="mr-2 inline-block" /> Fill Form
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;