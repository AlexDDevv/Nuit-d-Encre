import { NocturneLoader } from "@/components/UI/loader";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import AdminRequired from "@/components/sections/auth/AdminRequired";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuthContext();

    if (isLoading)
        return <NocturneLoader concept="medaillon" fullscreen label />;

    if (!user || user.role !== "admin") {
        return <AdminRequired />;
    }

    return <>{children}</>;
};

export default AdminRoute;
