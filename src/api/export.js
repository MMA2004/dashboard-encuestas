const API_BASE = import.meta.env.VITE_SURVEYS_API_BASE;

export async function downloadSurveyExport(token, surveyId, format = "csv") {
    const url = `${API_BASE}/owner/surveys/${surveyId}/export?format=${format}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error exportando");
    }

    const blob = await res.blob();

    // intenta leer filename del header
    const cd = res.headers.get("content-disposition") || "";
    const match = cd.match(/filename="(.+?)"/);
    const filename = match ? match[1] : `responses.${format}`;

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
}
