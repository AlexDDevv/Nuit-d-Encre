import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "@/components/sections/footer/Footer";
import Header from "@/components/sections/header/Header";

function App() {
    return (
        <>
            <Toaster richColors position="bottom-center" closeButton />
            <Header />
            <main className="my-20 flex flex-col gap-20 px-6">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default App;
