import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ToasterProvider } from "./components/Toaster/ToasterProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ToasterProvider>
            <App />
        </ToasterProvider>
    </StrictMode>,
);
