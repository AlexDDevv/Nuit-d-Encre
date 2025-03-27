import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ToasterProvider } from "./components/UI/Toaster/ToasterProvider.tsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// const client_id = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* <GoogleOAuthProvider clientId={client_id}> */}
        <ToasterProvider>
            <App />
        </ToasterProvider>
        {/* </GoogleOAuthProvider> */}
    </StrictMode>,
);
