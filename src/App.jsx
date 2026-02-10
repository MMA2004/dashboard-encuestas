import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SurveyResponses from "./pages/SurveyResponses";
import ResponseDetail from "./pages/ResponseDetail";

export default function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/dashboard/surveys/:surveyId/responses"
                    element={
                        <RequireAuth>
                            <SurveyResponses />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/dashboard/surveys/:surveyId/responses/:responseId"
                    element={
                        <RequireAuth>
                            <ResponseDetail />
                        </RequireAuth>
                    }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>

    );
}
