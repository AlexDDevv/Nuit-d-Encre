import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "@/components/sections/sidebar/Sidebar";

function App() {
    return (
        <>
            <Toaster richColors position="bottom-center" closeButton />
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex flex-1 flex-col gap-20 p-10">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default App;
