import NavBar from "./NavBar";
import Logo from "./UI/Logo";

export default function Header() {
    return (
        <header className="bg-card border-border flex items-center justify-between gap-5 rounded-xl border p-6">
            <Logo />
            <NavBar />
        </header>
    );
}
