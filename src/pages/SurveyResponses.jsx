import React, { useEffect, useState } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { getSurveyResponses } from "../api/owner";
import { downloadSurveyExport } from "../api/export";


/* =========================
   Helper estrellas
========================= */
function renderStars(value) {
    const n = Math.max(0, Math.min(5, Number(value || 0)));

    return (
        <span className="d-inline-flex align-items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <i
                    key={i}
                    className={`bi ${i < n ? "bi-star-fill" : "bi-star"} text-warning`}
                />
            ))}
            <span className="ms-2 text-muted small">{n}/5</span>
        </span>
    );
}

/* =========================
   Página principal
========================= */
export default function SurveyResponses() {
    const { surveyId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [starsFilter, setStarsFilter] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (!surveyId) return;

        (async () => {
            try {
                setError("");
                setLoading(true);

                const token = await getToken();
                const res = await getSurveyResponses(token, surveyId, 1, 20);

                setData(res);
            } catch (e) {
                setError(e.message || "Error cargando respuestas");
            } finally {
                setLoading(false);
            }
        })();
    }, [surveyId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container py-4">
                    <Loading />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container py-4">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }

    if (!data) return null;

    /* =========================
       Filtrado por estrellas
    ========================= */
    const filteredResponses = data.responses.filter((r) => {
        if (starsFilter === "all") return true;

        const starsAnswer = r.answers?.find(a => a.type === "stars");
        if (!starsAnswer) return false;

        return String(starsAnswer.value) === starsFilter;
    });

    return (
        <>
            <Navbar />


            <div className="container py-4">
                <div className="d-flex align-items-end justify-content-between mb-4 gap-3 flex-wrap">
                    <div>

                        <div className="mb-2">
                            <button
                                className="btn btn-outline-dark btn-sm"
                                onClick={() => navigate("/dashboard")}
                            >
                                <i className="bi bi-arrow-left me-2" />
                                Atrás
                            </button>
                        </div>

                        <h4 className="mb-1 fw-bold">{data.survey.title}</h4>
                        <div className="text-muted small">
                            <i className="bi bi-inboxes-fill me-2" />
                            {data.pagination.total} respuestas recibidas
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* Grupo de Exportación */}
                        <div className="btn-group shadow-sm" role="group">
                            <button
                                className="btn btn-light bg-white border text-secondary fw-medium px-3"
                                disabled={exporting}
                                onClick={async () => {
                                    try {
                                        setExporting(true);
                                        const token = await getToken();
                                        await downloadSurveyExport(token, surveyId, "csv");
                                    } finally {
                                        setExporting(false);
                                    }
                                }}
                            >
                                <i className="bi bi-filetype-csv text-primary me-2" />
                                CSV
                            </button>
                            <button
                                className="btn btn-light bg-white border text-secondary fw-medium px-3"
                                disabled={exporting}
                                onClick={async () => {
                                    try {
                                        setExporting(true);
                                        const token = await getToken();
                                        await downloadSurveyExport(token, surveyId, "xlsx");
                                    } finally {
                                        setExporting(false);
                                    }
                                }}
                            >
                                <i className="bi bi-file-earmark-excel text-success me-2" />
                                Excel
                            </button>
                        </div>

                        {/* Filtro de Estrellas */}
                        {/* Filtro de Estrellas Custom */}
                        <div className="position-relative">
                            <div
                                className="input-group shadow-sm input-group-seamless"
                                style={{ width: "auto", cursor: "pointer" }}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-funnel" />
                                </span>
                                <div
                                    className="form-control border-start-0 ps-0 bg-white d-flex align-items-center justify-content-between"
                                    style={{
                                        width: "160px",
                                        userSelect: "none"
                                    }}
                                >
                                    <span className="text-truncate">
                                        {starsFilter === "all"
                                            ? "Todas"
                                            : starsFilter === "0"
                                                ? "0 Estrellas"
                                                : <span>
                                                    {starsFilter} <i className="bi bi-star-fill text-warning small ms-1" />
                                                </span>
                                        }
                                    </span>
                                    <i className="bi bi-chevron-down small text-muted ms-2" />
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <>
                                    <div
                                        className="position-fixed top-0 start-0 w-100 h-100"
                                        style={{ zIndex: 1040 }}
                                        onClick={() => setDropdownOpen(false)}
                                    />
                                    <div
                                        className="dropdown-menu show shadow-sm w-100 mt-1"
                                        style={{ zIndex: 1050 }}
                                    >
                                        <button
                                            className={`dropdown-item d-flex align-items-center justify-content-between ${starsFilter === "all" ? "active" : ""}`}
                                            onClick={() => {
                                                setStarsFilter("all");
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            Todas
                                        </button>
                                        {[5, 4, 3, 2, 1, 0].map((star) => (
                                            <button
                                                key={star}
                                                className={`dropdown-item d-flex align-items-center justify-content-between ${starsFilter === String(star) ? "active" : ""}`}
                                                onClick={() => {
                                                    setStarsFilter(String(star));
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                <span>
                                                    {star === 0 ? "0 Estrellas" : (
                                                        <>
                                                            {star} <i className="bi bi-star-fill text-warning small ms-1" />
                                                        </>
                                                    )}
                                                </span>
                                                {starsFilter === String(star) && (
                                                    <i className="bi bi-check-lg" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>


                {/* Tabla */}
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Calificación</th>
                                    <th className="text-end">Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResponses.map((r) => {
                                    const starsAnswer = r.answers?.find(
                                        a => a.type === "stars"
                                    );

                                    return (
                                        <tr key={r._id}>
                                            <td>
                                                {new Date(r.createdAt).toLocaleString()}
                                            </td>

                                            <td>
                                                {starsAnswer
                                                    ? renderStars(starsAnswer.value)
                                                    : <span className="text-muted">—</span>
                                                }
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/surveys/${surveyId}/responses/${r._id}`
                                                        )
                                                    }
                                                >
                                                    Ver detalle{" "}
                                                    <i className="bi bi-chevron-right ms-1" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredResponses.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center text-muted py-4"
                                        >
                                            No hay respuestas con{" "}
                                            {starsFilter === "all"
                                                ? "este filtro"
                                                : `${starsFilter} estrellas`}
                                            .
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer info */}
                <div className="text-muted small mt-3">
                    <i className="bi bi-info-circle me-2" />
                    Puedes filtrar rápidamente las respuestas por nivel de satisfacción.
                </div>
            </div>
        </>
    );
}
