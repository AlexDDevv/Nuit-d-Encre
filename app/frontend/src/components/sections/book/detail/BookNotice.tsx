import { FaGlobe } from "react-icons/fa6";
import { Book } from "@/types/types";
import { langLabel } from "../preview/previewLabels";
import { formatLabelMap } from "@/lib/filterMaps";
import NoticePanel, {
    NoticeRow,
    Missing,
} from "@/components/sections/shared/Notice";

/**
 * « Informations complémentaires » — notice de catalogue en monospace (façon
 * page d'import). Affiche « manquant » en ambre pour les champs absents.
 */
export default function BookNotice({ book }: { book: Book }) {
    const lang = langLabel(book.language);
    const format = book.format ? formatLabelMap[book.format] : null;

    return (
        <NoticePanel title="Informations complémentaires">
            <NoticeRow label="ISBN-13" value={book.isbn13 || <Missing />} />
            <NoticeRow label="ISBN-10" value={book.isbn10 || <Missing />} />
            <NoticeRow
                label="Pages"
                value={book.pageCount ? book.pageCount : <Missing />}
            />
            <NoticeRow label="Parution" value={book.publishedYear} />
            <NoticeRow
                label="Langue"
                value={lang ?? <Missing />}
                icon={
                    <FaGlobe
                        size={12}
                        className="text-primary/55"
                        aria-hidden="true"
                    />
                }
            />
            <NoticeRow label="Éditeur" value={book.publisher || <Missing />} />
            <NoticeRow label="Format" value={format ?? <Missing />} last />
        </NoticePanel>
    );
}
