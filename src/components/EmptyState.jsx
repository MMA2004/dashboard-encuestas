import React from "react";

export default function EmptyState({ icon, title, subtitle }) {
    return (
        <div className="border rounded p-4 text-center text-muted mb-3 bg-white">
            <div className="fs-1 mb-2">
                <i className={`bi ${icon}`} />
            </div>
            <div className="fw-semibold text-dark">{title}</div>
            <div className="small">{subtitle}</div>
        </div>
    );
}
