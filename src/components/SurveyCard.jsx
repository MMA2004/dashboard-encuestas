import React from "react";
import { useNavigate } from "react-router-dom";

export default function SurveyCard({ survey }) {
    const navigate = useNavigate();

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-1">{survey.title}</h5>
                    <span className={`badge ${survey.isActive ? "text-bg-success" : "text-bg-secondary"}`}>
            {survey.isActive ? "Activa" : "Inactiva"}
          </span>
                </div>

                <div className="text-muted small mb-3">
                    <i className="bi bi-calendar3 me-2" />
                    {survey.createdAt}
                </div>

                <div className="d-flex align-items-center justify-content-between">
                    <div className="text-muted small">
                        <i className="bi bi-inboxes me-2" />
                        {survey.responsesCount ?? 0} respuestas
                    </div>

                    <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => navigate(`/dashboard/surveys/${survey._id}/responses`)}
                    >
                        Ver respuestas <i className="bi bi-chevron-right ms-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}

