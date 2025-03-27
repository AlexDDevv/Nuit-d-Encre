import { Link } from "react-router-dom";
import SignInForm from "../components/form/SignInForm";

export default function SignIn() {
    return (
        <section className="mx-auto flex w-full max-w-lg flex-col gap-7">
            <div className="bg-card border-border w-full rounded-xl border px-6 py-5">
                <h1 className="text-card-foreground font-title mb-7 text-center text-2xl font-bold">
                    Se connecter
                </h1>
                <SignInForm />
            </div>
            <p className="text-muted-foreground text-center">
                Vous n'avez pas encore de compte?{" "}
                <Link
                    to={"/signup"}
                    className="text-primary cursor-pointer font-semibold transition-opacity duration-200 ease-in-out hover:opacity-90"
                >
                    Inscrivez vous!
                </Link>
            </p>
        </section>
    );
}
