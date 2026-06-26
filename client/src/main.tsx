import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const originalFetch = window.fetch.bind(window);

window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string"
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url;

  if (typeof url === "string" && url.startsWith("/api") && apiBaseUrl) {
    return originalFetch(`${apiBaseUrl}${url}`, init);
  }

  return originalFetch(input, init);
}) as typeof window.fetch;

createRoot(document.getElementById("root")!).render(<App />);
