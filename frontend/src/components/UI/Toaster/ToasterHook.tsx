import { useContext } from "react";
import { ToastContext } from "./ToasterContext";

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error(
            "useToast doit être utilisé dans un NotificationProvider"
        );
    }
    return context;
};
