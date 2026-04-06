import { useMutation } from "@apollo/client";
import { IMPORT_BOOK } from "@/graphql/book/book-search";

export function useImportBook() {
    const [importBook, { loading }] = useMutation<{
        importFromOpenLibrary: { id: string; title: string };
    }>(IMPORT_BOOK);

    return { importBook, isImporting: loading };
}
