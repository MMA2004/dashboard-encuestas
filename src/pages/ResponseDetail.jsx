import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { getResponseDetail } from "../api/owner";

/* =========================
   Helpers de UI
========================= */

const CHOICE_ORDER = ["Muy malo", "Malo", "Regular", "Bueno", "Muy bueno"];

function choiceBadgeClass(choice) {
    if (!choice) return "secondary";
    switch (choice) {
        case "Muy bueno":
            return "success";
        case "Bueno":
            return "primary";
        case "Regular":
            return "warning";
        case "Malo":
            return "danger";
        case "Muy malo":
            return "dark";
        default:
            return "secondary";
    }
}

function renderStars(value) {
    const n = Math.max(0, Math.min(5, Number(value || 0)));

    return (
        <span className="d-inline-flex align-items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <i
                    key={i}
                    className={`bi ${i < n ? "bi-star-fill" : "bi-star"
                        } text-warning`}
                />
            ))}
            <span className="ms-2 text-muted small">{n}/5</span>
        </span>
    );
}

/* =========================
   Renderer por tipo
========================= */

function AnswerBlock({ answer }) {
    if (answer.type === "stars") {
        return (
            <div className="d-flex align-items-center justify-content-between">
                <div className="fw-semibold">{answer.label}</div>
                {renderStars(answer.value)}
            </div>
        );
    }

    if (answer.type === "choice5") {
        return (
            <div className="d-flex align-items-center justify-content-between">
                <div className="fw-semibold">{answer.label}</div>
                <span
                    className={`badge text-bg-${choiceBadgeClass(
                        answer.value
                    )} px-3 py-2`}
                >
                    {answer.value}
                </span>
            </div>
        );
    }

    if (answer.type === "text") {
        return (
            <div>
                <div className="fw-semibold mb-2">{answer.label}</div>
                <div
                    className="border rounded p-3"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    {answer.value || "—"}
                </div>
            </div>
        );
    }

    // fallback (por si llega algo inesperado)
    return (
        <div>
            <div className="fw-semibold">{answer.label || answer.questionId}</div>
            <div className="text-muted">{String(answer.value ?? "—")}</div>
        </div>
    );
}

/* =========================
   Página principal
========================= */

export default function ResponseDetail() {
    const { surveyId, responseId } = useParams();
    const { getToken, isLoaded } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded || !surveyId || !responseId) return;

        (async () => {
            try {
                setError("");
                setLoading(true);
                const token = await getToken();
                const res = await getResponseDetail(token, surveyId, responseId);
                setData(res);
            } catch (e) {
                setError(e.message || "Error cargando respuesta");
            } finally {
                setLoading(false);
            }
        })();
    }, [isLoaded, surveyId, responseId]);

    return (
        <>
            <Navbar />

            <div className="container py-4">
                {loading && <Loading />}
                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && data && (
                    <>
                        {/* Header */}
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h4 className="mb-1">{data.survey.title}</h4>
                                <div className="text-muted small">
                                    <i className="bi bi-clock me-2" />
                                    {data.response.createdAt
                                        ? new Date(data.response.createdAt).toLocaleString()
                                        : "-"}
                                </div>
                            </div>

                            <Link
                                to={`/dashboard/surveys/${surveyId}/responses`}
                                className="btn btn-outline-dark btn-sm"
                            >
                                <i className="bi bi-arrow-left me-2" />
                                Volver
                            </Link>
                        </div>

                        {/* Contenido */}
                        <div className="row g-3">
                            {data.response.answers.map((a, idx) => (
                                <div className="col-12" key={idx}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <AnswerBlock answer={a} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {data.response.answers.length === 0 && (
                                <div className="col-12">
                                    <div className="text-muted text-center py-4">
                                        Esta respuesta no contiene información.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer info */}
                        <div className="text-muted small mt-4">
                            <i className="bi bi-info-circle me-2" />
                            Vista de consulta. Los datos no pueden ser editados.
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
