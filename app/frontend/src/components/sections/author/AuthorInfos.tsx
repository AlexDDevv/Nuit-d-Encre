import { AuthorInfoProps } from "@/types/types";
import Links from "@/components/UI/Links";

export default function AuthorInfos({ author }: AuthorInfoProps) {
    const authorInfos = [
        { label: "Date de naissance", value: author.birthDate },
        { label: "Nationalité", value: author.nationality },
        { label: "Lien Wikipedia", value: author.wikipediaUrl },
        { label: "Lien du site personnel", value: author.officialWebsite },
    ];

    const isUrl = (label: string) =>
        label === "Lien Wikipedia" || label === "Lien du site personnel";

    const getEmptyText = (label: string) => {
        switch (label) {
            case "Date de naissance":
                return "non renseignée";
            case "Nationalité":
                return "non renseignée";
            case "Lien Wikipedia":
            case "Lien du site personnel":
                return "non renseigné";
            default:
                return "non renseigné";
        }
    };

    return (
        <div>
            <ul className="flex flex-col gap-2">
                {authorInfos.map(({ label, value }) => (
                    <li key={label} className="text-secondary-foreground">
                        {isUrl(label) ? (
                            <span>
                                {label} :{" "}
                                {value ? (
                                    <Links
                                        href={value}
                                        label={
                                            label === "Lien Wikipedia"
                                                ? "lien vers Wikipedia"
                                                : "lien vers le site personnel"
                                        }
                                        category="author"
                                        ariaLabel={
                                            label === "Lien Wikipedia"
                                                ? `Consulter la page Wikipedia de ${author.firstname} ${author.lastname} (s'ouvre dans un nouvel onglet)`
                                                : `Visiter le site personnel de ${author.firstname} ${author.lastname} (s'ouvre dans un nouvel onglet)`
                                        }
                                        className="text-foreground text-base font-semibold hover:underline"
                                    />
                                ) : (
                                    <span>{getEmptyText(label)}</span>
                                )}
                            </span>
                        ) : (
                            <span>
                                {label} : {value || getEmptyText(label)}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
