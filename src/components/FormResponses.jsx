import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FormResponses = () => {
    const { id } = useParams();
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/forms/responses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setResponses(response.data);
                
            } catch (error) {
                console.error("Error fetching responses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [id]);

    if (loading) return (
        <div className="my-forms-section">
            <div className="container">
                <p className="text-center text-gray-500">Loading responses...</p>
            </div>
        </div>
    );

    if (responses.length === 0) return (
        <div className="my-forms-section">
            <div className="container">
                <div className="empty-card text-center p-5">
                    <div className="add-form-icon">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <p className="text-gray-500">No responses found for this form.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="my-forms-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Form Responses</h2>
                </div>
                
                <div className="forms-container">
                    {responses.map((response, index) => (
                        <div key={index} className="form-card">
                            <div className="form-meta">
                                <span>Submitted by: {response.username}</span>
                            </div>
                            
                            <div className="form-responses">
                                {Object.entries(typeof response.responses === "string" ? JSON.parse(response.responses) : response.responses).map(([key, value]) => (
                                    <div key={key} className="response-item mb-2">
                                        <strong>{key}:</strong> {value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormResponses;