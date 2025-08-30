import { AuthorInfoProps } from "@/types/types";

export default function AuthorInfos({ author }: AuthorInfoProps) {
    const AuthorInfos = [
        { label: "Date de naissance", value: author.birthdate },
        { label: "Nationalité", value: author.nationality },
        { label: "Lien Wikipedia", value: author.wikipediaUrl },
        { label: "Lien du site personnel", value: author.officialWebsite },
    ];

    return (
        <div>
            <ul className="flex flex-col gap-2">
                {AuthorInfos.map(({ label, value }) => (
                    <li key={label} className="text-secondary-foreground">
                        {label} : {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}
