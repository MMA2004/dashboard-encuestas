import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SurveyCard from "../components/SurveyCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { getOwnerSurveys } from "../api/owner";
import { useAuth } from "@clerk/clerk-react";

export default function Dashboard() {

    const [surveys, setSurveys] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { getToken, isLoaded } = useAuth();

    useEffect(() => {
        if (!isLoaded) return;

        (async () => {
            try {
                setError("");
                setLoading(true);
                const token = await getToken();
                const res = await getOwnerSurveys(token);
                setSurveys(res);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [getToken, isLoaded]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return surveys;
        return surveys.filter((s) => s.title.toLowerCase().includes(term));
    }, [q, surveys]);

    return (
        <>
            <Navbar />
            <div className="container py-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h3 className="mb-0">Mis encuestas</h3>
                </div>

                <div className="row g-2 mb-3">
                    <div className="col-12 col-md-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search" />
                            </span>
                            <input
                                className="form-control"
                                placeholder="Buscar por título…"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading && <Loading />}
                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && filtered.length === 0 && (
                    <EmptyState
                        icon="bi-clipboard2-data"
                        title="No hay encuestas para mostrar"
                        subtitle="Revisa que estés con la cuenta correcta."
                    />
                )}

                <div className="row g-3">
                    {filtered.map((s) => (
                        <div className="col-12 col-md-6" key={s._id}>
                            <SurveyCard survey={s} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
