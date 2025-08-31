import { AuthorInfoProps } from "@/types/types";
import Links from "@/components/UI/Links";

export default function AuthorInfos({ author }: AuthorInfoProps) {
    const AuthorInfos = [
        { label: "Date de naissance", value: author.birthDate },
        { label: "Nationalité", value: author.nationality },
        { label: "Lien Wikipedia", value: author.wikipediaUrl },
        { label: "Lien du site personnel", value: author.officialWebsite },
    ];

    const isUrl = (label: string) =>
        label === "Lien Wikipedia" || label === "Lien du site personnel";

    return (
        <div>
            <ul className="flex flex-col gap-2">
                {AuthorInfos.map(({ label, value }) => (
                    <li key={label} className="text-secondary-foreground">
                        {isUrl(label) ? (
                            <span>
                                {label} :{" "}
                                {value ? (
                                    <Links
                                        href={value}
                                        label={
                                            label === "Lien Wikipedia"
                                                ? "lien vers le Wikipedia"
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
                                    <span>non renseigné</span>
                                )}
                            </span>
                        ) : (
                            <span>
                                {label} :{" "}
                                {value ? value.toLowerCase() : "non renseignée"}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
