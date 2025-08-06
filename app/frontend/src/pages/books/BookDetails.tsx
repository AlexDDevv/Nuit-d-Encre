import { useBook } from "@/hooks/useBook";
import { useParams } from "react-router-dom";

export default function BookDetails() {
    const { slug } = useParams<{ slug: string }>();

    if (!slug) {
        throw new Response("Book not found", { status: 404 });
    }

    const [idStr] = slug.split("-");
    const id = idStr;

    const { book } = useBook(id)

    console.log("🚀 ~ BookDetails ~ book:", book)

    return (
        <div>BookDetails</div>
    )
}
