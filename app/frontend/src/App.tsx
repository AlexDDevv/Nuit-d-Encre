import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "./components/sections/footer/Footer";
import Header from "./components/sections/header/Header";

function App() {
    return (
        <>
            <Toaster richColors position="bottom-center" closeButton />
            <Header />
            <main className="flex flex-col gap-20 px-12">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default App;
