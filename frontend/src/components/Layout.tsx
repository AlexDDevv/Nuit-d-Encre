import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="flex flex-col gap-24">
            <Header />
            <main className="flex flex-col gap-20 px-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
