import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const configuredApiBaseUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const originalFetch = window.fetch.bind(window);

window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string"
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url;

  if (typeof url === "string" && url.startsWith("/api")) {
    if (configuredApiBaseUrl) {
      return originalFetch(`${configuredApiBaseUrl}${url}`, init);
    }

    const fallbackApiBaseUrl = window.location.origin.includes("s3-website")
      ? "http://54.179.181.85:5001"
      : "";

    if (fallbackApiBaseUrl) {
      return originalFetch(`${fallbackApiBaseUrl}${url}`, init);
    }
  }

  return originalFetch(input, init);
}) as typeof window.fetch;

createRoot(document.getElementById("root")!).render(<App />);
