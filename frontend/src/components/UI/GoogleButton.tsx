// import ActionButton from "./ActionButton";
// import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "./Toaster/ToasterHook";

export default function GoogleButton() {
    // const navigate = useNavigate();
    // const { addToast } = useToast();

    // const googleLogin = useGoogleLogin({
    //     onSuccess: (credentialResponse: TokenResponse) => {
    //         console.log(credentialResponse);
    //         navigate(`/`, { replace: true });
    //         addToast("Connexion réussie, bienvenue !", "success");
    //     },
    //     onError: () => {
    //         addToast("Impossible de vous connecter", "error");
    //     },
    // });

    return (
        <>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="bg-border h-0.5 w-full"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                        Ou continuer avec
                    </span>
                </div>
            </div>
            <button
                className="ring-offset-background focus-visible:ring-ring border-input bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2 font-medium whitespace-nowrap transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                // onClick={() => googleLogin}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="hsl(43, 30%, 85%)"
                        className="group-hover:fill-secondary transition-colors duration-200 ease-in-out"
                        d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866 c-3.431,0.635-6.862-1.865-7.19-5.339c-0.34-3.595,2.479-6.62,6.005-6.62c1.002,0,1.946,0.246,2.777,0.679 c0.757,0.395,1.683,0.236,2.286-0.368l0,0c0.954-0.954,0.701-2.563-0.498-3.179c-1.678-0.862-3.631-1.264-5.692-1.038 c-4.583,0.502-8.31,4.226-8.812,8.809C1.945,16.9,6.649,22,12.545,22c6.368,0,8.972-4.515,9.499-8.398 c0.242-1.78-1.182-3.352-2.978-3.354l-4.61-0.006C13.401,10.24,12.545,11.095,12.545,12.151z"
                    ></path>
                </svg>
                Google
            </button>
        </>

        // <div>
        //     <div className="afterBefore relative mb-7 text-center">
        //         <p className="text-card bg-card-foreground relative z-50 mx-auto w-34 rounded-xs text-xs font-semibold tracking-wide uppercase">
        //             Ou continuer avec
        //         </p>
        //     </div>
        //     <ActionButton
        //         bgColor="bg-secondary"
        //         color="text-secondary-foreground"
        //         content="Google"
        //         width="w-full"
        //         onClick={googleLogin}
        //     />
        // </div>
    );
}
