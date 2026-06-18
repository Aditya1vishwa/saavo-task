const isLocalhost = window.location.origin.includes("localhost");

export const apiDomain =
    import.meta.env.VITE_API_BASE_URL ||
    (isLocalhost ? "http://localhost:8002/api" : `${window.location.origin}/api`);

export const imgDomain =
    import.meta.env.VITE_IMG_BASE_URL ||
    (isLocalhost ? "http://localhost:8002/uploads/" : `${window.location.origin}/uploads/`);
import Cookies from "js-cookie";

// Fetch a binary file (e.g. PDF ticket) with auth and trigger a browser download.
export const downloadFile = async (url, filename = "download") => {
    try {
        const fullUrl = url.startsWith("/") ? apiDomain + url : url;
        const token = Cookies.get("accessToken");
        const headers = {};
        if (token) headers.Authorization = token;
        const response = await fetch(fullUrl, { method: "GET", headers, credentials: "include" });
        if (!response.ok) return false;
        const blob = await response.blob();
        const objUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(objUrl);
        return true;
    } catch {
        return false;
    }
};

export const apiCall = async (
    {
        url,
        method = "GET",
        data = {},
        isFormData = false,
        headers = {},
    },
    cb
) => {
    try {
        if (url.startsWith("/")) {
            url = apiDomain + url;
        }
        const token = Cookies.get("accessToken");
        const finalHeaders = {
            ...headers,
        };
        if (token) {
            finalHeaders.Authorization = token;
        }
        const options = {
            method,
            headers: finalHeaders,
            credentials: "include",
        };
        if (method === "GET" && Object.keys(data).length) {
            const query = new URLSearchParams(data).toString();
            url += url.includes("?") ? `&${query}` : `?${query}`;
        }
        if (method !== "GET") {
            if (isFormData) {
                options.body = data;
            } else {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(data);
            }
        }
        const response = await fetch(url, options);
        let result = null;
        try {
            result = await response.json();
        } catch {
            result = null;
        }
        if (!response.ok) {
            const errorResp = {
                status: 0,
                message:
                    result?.message ||
                    result?.error ||
                    response.statusText ||
                    "Server error",
            };
            if (typeof cb === "function") return await cb(errorResp, false);
            return errorResp;
        }
        if (typeof cb === "function") return await cb(result, result?.status === 1);
        return result;
    } catch (error) {
        const errorResp = {
            status: 0,
            message: "Network or server error",
            error: error.message,
        };
        if (typeof cb === "function") return await cb(errorResp, false);
        return errorResp;
    }
};
