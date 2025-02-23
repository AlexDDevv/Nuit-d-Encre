import { useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import avatar from "../assets/avatar.jfif";
import {
    CalendarDays,
    MapPinHouse,
    Star,
    MessagesSquare,
    Smartphone,
    MailCheck,
} from "lucide-react";
import ActionButton from "../components/UI/ActionButton";
import ProfilCards from "../components/UI/ProfilCards";

const verified = [
    {
        content: "100% de réponse",
        icon: <MessagesSquare className="text-accent h-5 w-5" />,
    },
    {
        content: "Téléphone vérifié",
        icon: <Smartphone className="text-accent h-5 w-5" />,
    },
    {
        content: "Email vérifié",
        icon: <MailCheck className="text-accent h-5 w-5" />,
    },
];

export default function Profil() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    console.log("🚀 ~ Profil ~ me:", me);

    const splitMail = me?.email?.split("@") || [];

    const frenchDate = me?.createdAt
        ? new Date(me.createdAt).toLocaleDateString("fr")
        : null;

    return (
        <section className="flex flex-col gap-10 px-12">
            <div className="border-border bg-card flex flex-col gap-7 rounded-xl border p-6">
                <div className="flex items-start justify-between gap-10">
                    <div className="flex items-center justify-center gap-6">
                        <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full">
                            <div className="absolute inset-0 z-10 rounded-full border-[5px] border-white mix-blend-soft-light"></div>
                            <div className="absolute inset-0 z-10 rounded-full border-[5px] border-white mix-blend-overlay"></div>
                            <img
                                src={avatar}
                                alt="Photo de profil"
                                className="h-full w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-card-foreground font-title text-lg font-bold">
                                {splitMail[0]}
                            </h1>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="text-card-foreground" />
                                <p className="text-card-foreground">
                                    Depuis le {frenchDate}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinHouse className="text-card-foreground" />
                                <span className="text-card-foreground">
                                    Rhône
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-primary fill-primary" />
                                <span className="text-card-foreground">
                                    5 (2 avis)
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        {verified.map((item, i) => (
                            <div
                                key={i}
                                className="flex max-w-16 flex-col items-center justify-center gap-1.5 text-center"
                            >
                                <div className="bg-accent-foreground flex h-11 w-11 items-center justify-center rounded-md p-3">
                                    {item.icon}
                                </div>
                                <span className="text-card-foreground text-xs">
                                    {item.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-xs font-medium">
                        1 annonce
                    </span>
                    <span className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-xs font-medium">
                        1 transaction
                    </span>
                </div>
                <div className="border-border max-w-2xl rounded-lg border p-5">
                    <p className="text-card-foreground">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ea perferendis sapiente doloribus temporibus inventore
                        exercitationem, expedita deserunt enim aliquid nesciunt
                        quisquam itaque nostrum voluptatum animi corrupti
                        maiores ex quos esse?
                    </p>
                </div>
                <ActionButton
                    bgColor="bg-primary"
                    color="text-primary-foreground"
                    content="Modifier le profil"
                    width="w-40"
                    margin="ml-auto"
                />
            </div>
            <ProfilCards />
        </section>
    );
}
