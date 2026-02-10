import React from "react";

export default function Loading() {
    return (
        <div className="d-flex align-items-center gap-2 text-muted py-4">
            <div className="spinner-border spinner-border-sm" role="status" />
            Cargando…
        </div>
    );
}
