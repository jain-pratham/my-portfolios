const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  body?: any;
}

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers || {}) as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
