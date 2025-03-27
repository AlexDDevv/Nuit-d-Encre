import { Link } from "react-router-dom";
import SignUpForm from "../components/form/SignUpForm";

export default function SignUp() {
    return (
        <section className="mx-auto flex w-full max-w-lg flex-col gap-7">
            <div className="bg-card border-border w-full rounded-xl border px-6 py-5">
                <h1 className="text-card-foreground font-title mb-7 text-center text-2xl font-bold">
                    Créer un compte
                </h1>
                <SignUpForm />
            </div>
            <p className="text-muted-foreground text-center">
                Vous avez déjà un compte?{" "}
                <Link
                    to={"/signin"}
                    className="text-primary cursor-pointer font-semibold transition-opacity duration-200 ease-in-out hover:opacity-90"
                >
                    Connectez vous!
                </Link>
            </p>
        </section>
    );
}
