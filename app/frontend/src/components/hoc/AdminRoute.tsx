import Loader from "@/components/UI/Loader"
import { useAuthContext } from "@/hooks/useAuthContext"
import AdminRequired from "@/components/sections/auth/AdminRequired"

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, isLoading } = useAuthContext()

	if (isLoading) return <Loader />

	if (!user || user.role !== "admin") {
		return <AdminRequired />
	}

	return <>{children}</>
}

export default AdminRoute
