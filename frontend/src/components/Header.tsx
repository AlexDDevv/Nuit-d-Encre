import NavBar from "./NavBar";
import Form from "./Form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useMutation, useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import { signOut } from "../api/signout";
import ActionButton from "./UI/ActionButton";

export default function Header() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    const navigate = useNavigate();
    const location = useLocation();

    const [doSignOut] = useMutation(signOut, { refetchQueries: [whoami] });

    const onSignOut = () => {
        doSignOut();
        navigate("/");
    };

    return (
        <header className="bg-card border-border flex flex-col gap-6 rounded-xl border p-6">
            <div className="flex items-center justify-between gap-5">
                <Link to="/">
                    <img src={logo} alt="The good corner" />
                </Link>
                <Form />
                {me ? (
                    me.role === "admin" ? (
                        location.pathname === "/admin" ? (
                            <div className="flex items-center justify-center gap-5">
                                <ActionButton
                                    bgColor="bg-primary"
                                    color="text-primary-foreground"
                                    path="ads/newAd"
                                    content="Publier une annonce"
                                />
                                <ActionButton
                                    bgColor="bg-destructive"
                                    color="text-destructive-foreground"
                                    content="Se déconnecter"
                                    onClick={onSignOut}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-5">
                                <ActionButton
                                    bgColor="bg-primary"
                                    color="text-primary-foreground"
                                    path="ads/newAd"
                                    content="Publier une annonce"
                                />
                                <ActionButton
                                    bgColor="bg-secondary"
                                    color="text-secondary-foreground"
                                    path="/admin"
                                    content="Admin"
                                />
                            </div>
                        )
                    ) : location.pathname === "/profil" ? (
                        <div className="flex items-center justify-center gap-5">
                            <ActionButton
                                bgColor="bg-primary"
                                color="text-primary-foreground"
                                path="ads/newAd"
                                content="Publier une annonce"
                            />
                            <ActionButton
                                bgColor="bg-destructive"
                                color="text-destructive-foreground"
                                content="Se déconnecter"
                                onClick={onSignOut}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-5">
                            <ActionButton
                                bgColor="bg-primary"
                                color="text-primary-foreground"
                                path="ads/newAd"
                                content="Publier une annonce"
                            />
                            <ActionButton
                                bgColor="bg-secondary"
                                color="text-secondary-foreground"
                                path="/profil"
                                content="Profil"
                            />
                        </div>
                    )
                ) : me === null ? (
                    <div className="flex items-center justify-center gap-5">
                        <ActionButton
                            bgColor="bg-primary"
                            color="text-primary-foreground"
                            path="/signup"
                            content="S'inscrire"
                        />
                        <ActionButton
                            bgColor="bg-secondary"
                            color="text-secondary-foreground"
                            path="/signin"
                            content="Se connecter"
                        />
                    </div>
                ) : null}
            </div>
            <NavBar />
        </header>
    );
}
