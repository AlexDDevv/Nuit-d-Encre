import { useUserBooksData } from "@/hooks/userBook/useUserBooksData";

export default function UserLibrary() {
    const { userBooks } = useUserBooksData({ mode: "library" });
    console.log("🚀 ~ UserLibrary ~ userBooks:", userBooks);

    return (
        <div>
            <h1>Ma bibliothèque personnelle</h1>
        </div>
    );
}
