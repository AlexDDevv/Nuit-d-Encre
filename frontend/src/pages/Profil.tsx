import { useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import avatar from "../../public/images/avatar.jfif";

export default function Profil() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    console.log("🚀 ~ Profil ~ me:", me);

    return (
        <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full">
            <div className="absolute inset-0 z-10 rounded-full border-4 border-white mix-blend-soft-light"></div>
            <div className="absolute inset-0 z-10 rounded-full border-4 border-white mix-blend-overlay"></div>
            <img src={avatar} alt="Photo de profil" className="h-full w-full" />
        </div>
    );
}
