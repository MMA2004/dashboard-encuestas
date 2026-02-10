import React from "react";
import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between">
                <button
                    className="navbar-brand btn btn-link text-white text-decoration-none p-0"
                    onClick={() => navigate("/dashboard")}
                >
                    <i className="bi bi-speedometer2 me-2" />
                    Dashboard Dueño
                </button>

                <div className="d-flex align-items-center gap-3">
                    <UserButton />
                </div>
            </div>
        </nav>
    );
}
