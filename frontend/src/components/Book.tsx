import { Star } from "lucide-react";
import SelectBookState from "./UI/SelectBookState";
import { BookProps } from "../../types";

export default function Book({ book, googleBook, author }: BookProps) {
    return (
        <section className="mx-auto mb-36 flex max-w-[1440px] flex-col gap-y-24">
            <div className="flex h-[500px] items-center justify-start gap-x-12">
                <div className="h-full w-[320px]">
                    <img
                        src={`https://covers.openlibrary.org/b/id/${book.covers}-L.jpg`}
                        alt={`Image de couverture du livre ${book.title}`}
                        className="h-full w-full rounded-xl"
                    />
                </div>
                <div className="flex h-full flex-col justify-between gap-5">
                    <div>
                        <h1 className="font-titleFont text-foreground mb-4 text-5xl font-bold">
                            {book.title}
                        </h1>
                        <h2 className="font-titleFont text-foreground text-xl font-semibold italic">
                            {author.name}
                        </h2>
                    </div>
                    {googleBook.volumeInfo?.description ? (
                        <>
                            {googleBook.volumeInfo?.description.length > 200 ? (
                                <p className="font-bodyFont text-foreground max-w-[650px] text-lg">
                                    {googleBook.volumeInfo?.description.substring(
                                        0,
                                        200,
                                    )}
                                    ...
                                    <a
                                        href="#description"
                                        className="font-bodyFont text-destructive-foreground ml-2 text-lg font-bold"
                                    >
                                        Lire la suite
                                    </a>
                                </p>
                            ) : (
                                <p className="font-bodyFont text-foreground max-w-[650px] text-lg">
                                    {googleBook.volumeInfo?.description}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="font-bodyFont text-foreground text-lg">
                            Description du livre indisponible...
                        </p>
                    )}
                    <div>
                        <div className="mb-1 flex gap-x-2">
                            <Star className="text-foreground cursor-pointer"></Star>
                            <Star className="text-foreground cursor-pointer"></Star>
                            <Star className="text-foreground cursor-pointer"></Star>
                            <Star className="text-foreground cursor-pointer"></Star>
                            <Star className="text-foreground cursor-pointer"></Star>
                        </div>
                        <p className="font-bodyFont text-foreground text-sm font-medium">
                            Nombre de notes
                        </p>
                    </div>
                    {googleBook.saleInfo?.isEbook === false ? (
                        <p className="font-bodyFont text-foreground text-lg font-semibold">
                            Indisponible en Ebook
                        </p>
                    ) : (
                        <p className="font-bodyFont text-foreground text-lg font-semibold">
                            Disponible en Ebook
                        </p>
                    )}
                    <div className="flex items-center gap-x-3">
                        <h3 className="font-titleFont text-foreground font-medium">
                            {author?.name}
                        </h3>
                    </div>
                    <SelectBookState />
                </div>
            </div>
            <div className="flex justify-between gap-x-24">
                <div id="description" className="max-w-[568px]">
                    <h4 className="font-titleFont text-foreground mb-9 text-4xl font-bold">
                        Résumé :
                    </h4>
                    {googleBook.volumeInfo?.description ? (
                        <p className="font-bodyFont text-secondary-foreground text-lg">
                            {googleBook.volumeInfo?.description}
                        </p>
                    ) : (
                        <p className="font-bodyFont text-secondary-foreground text-lg">
                            Description du livre indisponible...
                        </p>
                    )}
                </div>
                <div className="">
                    <h4 className="font-titleFont text-foreground mb-9 text-4xl font-bold">
                        Informations complémentaires :
                    </h4>
                    <ul className="font-bodyFont text-secondary-foreground flex flex-col gap-y-5 text-lg font-medium">
                        <li>
                            Éditeur :{" "}
                            <span className="ml-1 font-normal">
                                {book.publishers?.[0]}
                            </span>
                        </li>
                        <li>
                            Date de publication :{" "}
                            <span className="ml-1 font-normal">
                                {book.publish_date}
                            </span>
                        </li>
                        <li>
                            Langue :{" "}
                            <span className="ml-1 font-normal">
                                {book.publish_country}
                            </span>
                        </li>
                        <li>
                            Nombre de pages :{" "}
                            <span className="font-normal">
                                {book.number_of_pages}
                            </span>
                        </li>
                        {googleBook.volumeInfo?.categories ? (
                            <li>
                                Genre :{" "}
                                <span className="ml-1 font-normal">
                                    {googleBook.volumeInfo?.categories}
                                </span>
                            </li>
                        ) : (
                            <li>
                                Genre :{" "}
                                <span className="ml-1 font-normal">
                                    Genre indisponible
                                </span>
                            </li>
                        )}
                        <li>
                            ISBN-10 :{" "}
                            <span className="ml-1 font-normal">
                                {book.isbn_10?.[0]}
                            </span>
                        </li>
                        <li>
                            ISBN-13 :{" "}
                            <span className="ml-1 font-normal">
                                {book.isbn_13?.[0]}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
