import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function RequireAuth({ children }) {
    const { isLoaded, isSignedIn } = useAuth();
    const location = useLocation();

    // Mientras Clerk carga la sesión, NO redirijas (evita el loop)
    if (!isLoaded) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
