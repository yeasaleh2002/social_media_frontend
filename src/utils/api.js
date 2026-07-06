export async function customFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://social-media-backend-ncz5.onrender.com/api";
  const url = endpoint.startsWith("/") ? `${baseUrl}${endpoint.replace(/^\/api/, '')}` : endpoint;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMsg = (data && data.message) || response.statusText || "Something went wrong";
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

export const api = {
  get: (url, options = {}) => customFetch(url, { method: "GET", ...options }),
  post: (url, data, options = {}) => customFetch(url, { method: "POST", body: JSON.stringify(data), ...options }),
  put: (url, data, options = {}) => customFetch(url, { method: "PUT", body: JSON.stringify(data), ...options }),
  delete: (url, options = {}) => customFetch(url, { method: "DELETE", ...options }),
};
