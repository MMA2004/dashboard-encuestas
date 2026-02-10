import { apiFetch } from "./client";

export function getOwnerSurveys(token) {
    return apiFetch("/owner/surveys", {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export function getSurveyResponses(token, surveyId, page = 1, limit = 20) {
    return apiFetch(
        `/owner/surveys/${surveyId}/responses?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export function getResponseDetail(token, surveyId, responseId) {
    return apiFetch(`/owner/surveys/${surveyId}/responses/${responseId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}