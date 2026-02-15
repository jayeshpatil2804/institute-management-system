import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store"; // Import the store we created
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import axios from "axios";
import "./index.css";

// Set global axios defaults
axios.defaults.withCredentials = true;

// Service Worker Update Handler
if ('serviceWorker' in navigator) {
  let refreshing = false;

  // Detect controller change and reload the page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Check for updates periodically (every 1 hour)
  setInterval(() => {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        reg.update();
      }
    });
  }, 60 * 60 * 1000); // 1 hour

  // Also check for updates when the page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.update();
        }
      });
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
