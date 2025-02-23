import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CategoryType, TagType, AdType } from "../../types";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";
import { queryTags } from "../api/tags";
import { createAd } from "../api/createAd";
import { queryAds } from "../api/ads";
import { queryAd } from "../api/ad";
import { updateAd } from "../api/updateAd";
import { ImageUp, SquareChevronRight, SquareChevronLeft } from "lucide-react";
import { whoami } from "../api/whoami";
import { useToast } from "../components/UI/Toaster/ToasterHook";
import clsx from "clsx";
import CarrouselArrow from "../components/UI/CarrouselArrow";
import ActionButton from "../components/UI/ActionButton";

export default function AdFormPage() {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const id = params.id && Number(params.id);

    const { data: adData } = useQuery<{ ad: AdType }>(queryAd, {
        variables: { adId: id },
        skip: !id,
    });
    const ad = adData?.ad;
    console.log(ad);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState("");
    const [picture, setPicture] = useState<string[]>([]);
    const [owner, setOwner] = useState("");
    const [categoryId, setCategoryId] = useState<number>();
    const [tagsIds, setTagsIds] = useState<number[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [carrouselIndex, setCarrouselIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">(
        "right",
    );
    const { addToast } = useToast();

    useEffect(() => {
        if (ad) {
            setTitle(ad.title);
            setDescription(ad.description);
            setPrice(ad.price);
            setLocation(ad.location);
            setPicture(ad.picture);
            setOwner(ad.owner);
            setCategoryId(ad.category?.id ?? 0);
            setTagsIds(ad.tags.map((tag) => tag.id) ?? []);
        } else {
            setTitle("");
            setDescription("");
            setPrice(0);
            setLocation("");
            setPicture([]);
            setOwner("");
            setCategoryId(0);
            setTagsIds([]);
        }
    }, [ad]);

    const { data: categoriesData } = useQuery<{ categories: CategoryType[] }>(
        queryCategories,
    );
    const categories = categoriesData?.categories;

    useEffect(() => {
        if (categories && categories.length && !categoryId) {
            setCategoryId(categories[0].id);
        }
    }, [categories]);

    const { data: tagsData } = useQuery<{ tags: TagType[] }>(queryTags);
    const tags = tagsData?.tags;

    const [doCreateAd] = useMutation<{
        createAd: AdType;
    }>(createAd, {
        refetchQueries: [queryAds],
    });

    const [doUpdateAd] = useMutation<{
        updateAd: AdType;
    }>(updateAd, {
        refetchQueries: [queryAds, queryAd],
    });

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        const maxFileSize = 2 * 1024 * 1024;
        const validFiles: File[] = [];

        Array.from(files).forEach((file) => {
            if (file.size > maxFileSize) {
                addToast(
                    `La taille de l'image ${file.name} dépasse 2 Mo.`,
                    "warning",
                );
            } else {
                validFiles.push(file);
            }
        });

        const readers = validFiles.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                        resolve(reader.result);
                    } else {
                        reject(
                            new Error(
                                `Erreur lors de la lecture du fichier ${file.name}`,
                            ),
                        );
                        addToast(
                            `Erreur lors de la lecture du fichier ${file.name}`,
                            "error",
                        );
                    }
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then((base64Strings) => {
                setPicture((prev) => [...prev, ...base64Strings]);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la lecture des fichiers :",
                    error,
                );
                addToast("Erreur lors de la lecture des fichiers.", "error");
            });
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("left");
        setPrevIndex(carrouselIndex);
        setCarrouselIndex((prevIndex) =>
            prevIndex === 0 ? picture.length - 1 : prevIndex - 1,
        );
    };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("right");
        setPrevIndex(carrouselIndex);
        setCarrouselIndex((prevIndex) =>
            prevIndex === picture.length - 1 ? 0 : prevIndex + 1,
        );
    };

    const doSubmit = async () => {
        const requiredFields = [
            title,
            description,
            price,
            location,
            picture,
            owner,
        ];

        const isFormValid = requiredFields.every(
            (field) =>
                field && (Array.isArray(field) ? field.length > 0 : true),
        );

        if (!isFormValid) {
            addToast(
                "Veuillez remplir tous les champs nécessaires.",
                "warning",
            );
            setError(true);
            return;
        }

        try {
            if (ad) {
                const { data } = await doUpdateAd({
                    variables: {
                        id: ad.id,
                        data: {
                            title,
                            description,
                            price,
                            location,
                            picture,
                            owner,
                            category: categoryId ? { id: categoryId } : null,
                            tags: tagsIds.map((id) => ({ id })),
                        },
                    },
                });
                addToast("Annonce modifiée avec succès.", "success");
                navigate(`/ads/${data?.updateAd.id}`, { replace: true });
            } else {
                const { data } = await doCreateAd({
                    variables: {
                        data: {
                            title,
                            description,
                            price,
                            location,
                            picture,
                            owner,
                            category: categoryId ? { id: categoryId } : null,
                            tags: tagsIds.map((id) => ({ id })),
                        },
                    },
                });
                addToast("Annonce créée avec succès.", "success");
                navigate(`/ads/${data?.createAd.id}`, { replace: true });
            }
        } catch (err) {
            addToast(
                "Une erreur est survenue lors de la création de l'annonce.",
                "error",
            );
        }
    };

    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;

    return (
        <section className="bg-card border-border mx-auto max-w-5xl rounded-lg border px-6 py-5">
            <h1 className="text-card-foreground font-title mb-12 text-center text-2xl font-bold">
                {ad ? "Modifier une annonce" : "Poster une annonce"}
            </h1>
            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    doSubmit();
                }}
            >
                <div className="mb-10 flex w-full flex-col justify-center gap-5">
                    <div className="flex w-full gap-5">
                        <div className="flex w-1/2 flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-card-foreground text-sm"
                                    htmlFor="title"
                                >
                                    Titre de l'annonce *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Ajouter un titre..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={clsx(
                                        "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                        error &&
                                            "border-destructive outline-destructive border",
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-card-foreground text-sm"
                                    htmlFor="price"
                                >
                                    Prix de l'annonce *
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    placeholder="Ajouter un prix..."
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(Number(e.target.value))
                                    }
                                    className={clsx(
                                        "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                        error &&
                                            "border-destructive outline-destructive border",
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex w-1/2 flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-card-foreground text-sm"
                                    htmlFor="owner"
                                >
                                    Propriétaire de l'annonce *
                                </label>
                                <input
                                    id="owner"
                                    type="text"
                                    placeholder="Ajouter une adresse mail..."
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                    className={clsx(
                                        "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                        error &&
                                            "border-destructive outline-destructive border",
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-card-foreground text-sm"
                                    htmlFor="location"
                                >
                                    Localisation de l'annonce *
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="Ajouter une localisation..."
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    className={clsx(
                                        "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                        error &&
                                            "border-destructive outline-destructive border",
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label
                            className="text-card-foreground text-sm"
                            htmlFor="description"
                        >
                            Description de l'annonce *
                        </label>
                        <textarea
                            id="description"
                            placeholder="Ajouter une description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={clsx(
                                "bg-input text-accent-foreground focus:outline-ring font-body h-24 resize-none rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                error &&
                                    "border-destructive outline-destructive border",
                            )}
                        ></textarea>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label
                            className="text-card-foreground text-sm"
                            htmlFor="picture"
                        >
                            Déposer une image *
                        </label>
                        <div
                            className={clsx(
                                "bg-input focus:outline-ring relative z-50 flex h-96 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg focus:outline-2",
                                error &&
                                    "border-destructive outline-destructive border",
                            )}
                            onClick={() => {
                                const inputField = document.querySelector(
                                    ".input-field",
                                ) as HTMLInputElement;
                                if (inputField) {
                                    inputField.click();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    const inputField = document.querySelector(
                                        ".input-field",
                                    ) as HTMLInputElement;
                                    if (inputField) {
                                        inputField.click();
                                    }
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const file = e.dataTransfer.files[0];
                                if (file) {
                                    handleImages({ target: { files: [file] } });
                                }
                            }}
                            tabIndex={0}
                        >
                            <input
                                id="picture"
                                type="file"
                                accept="image/*"
                                hidden
                                multiple
                                className="input-field bg-input text-accent-foreground focus:outline-ring h-full w-full rounded-lg text-xs placeholder:italic placeholder:opacity-85 focus:outline-2"
                                onChange={handleImages}
                            />
                            {picture.length > 0 ? (
                                <div className="absolute inset-0 h-full w-full">
                                    <div className="relative mx-auto flex h-full w-full items-center justify-center overflow-hidden py-4">
                                        {picture.map((preview, index) => {
                                            const isVisible =
                                                index === carrouselIndex;
                                            const isExiting =
                                                index === prevIndex;

                                            return (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className={clsx(
                                                        "absolute h-80 w-80 rounded-lg object-cover transition-all duration-500 ease-in-out",
                                                        isVisible
                                                            ? "translate-x-0 opacity-100"
                                                            : "opacity-0",
                                                        !isVisible &&
                                                            (slideDirection ===
                                                            "right"
                                                                ? isExiting
                                                                    ? "-translate-x-full"
                                                                    : "translate-x-full"
                                                                : isExiting
                                                                  ? "translate-x-full"
                                                                  : "-translate-x-full"),
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2.5 transition-transform duration-200 ease-in-out hover:scale-105">
                                    <ImageUp className="text-accent-foreground h-20 w-20" />
                                    <p className="text-accent-foreground">
                                        Déposez une image ou téléchargez en une
                                    </p>
                                </div>
                            )}
                            {picture.length > 1 && (
                                <>
                                    <CarrouselArrow
                                        onClick={prevSlide}
                                        direction="left"
                                        label="Previous slide"
                                    >
                                        <SquareChevronLeft className="text-accent-foreground hover:text-primary h-full w-full transition-all duration-200 ease-in-out hover:scale-105" />
                                    </CarrouselArrow>
                                    <CarrouselArrow
                                        onClick={nextSlide}
                                        direction="right"
                                        label="Next slide"
                                    >
                                        <SquareChevronRight className="text-accent-foreground hover:text-primary h-full w-full transition-all duration-200 ease-in-out hover:scale-105" />
                                    </CarrouselArrow>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full gap-5">
                        <div className="flex w-1/2 flex-col gap-1">
                            <label
                                className="text-card-foreground text-sm"
                                htmlFor="categories"
                            >
                                Sélectionnez une catégorie
                            </label>
                            <div className="flex items-center justify-center gap-2.5">
                                <select
                                    id="categories"
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(Number(e.target.value))
                                    }
                                    className={clsx(
                                        "bg-input text-accent-foreground focus:outline-ring cursor-pointer rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                        me?.role === "admin"
                                            ? "w-[55%]"
                                            : "w-full",
                                    )}
                                >
                                    {categories?.map(
                                        (category: CategoryType) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="flex w-1/2 flex-col gap-1">
                            <label className="text-card-foreground text-sm">
                                Sélectionnez un ou plusieurs tags
                            </label>
                            <div className="flex items-center justify-between gap-2.5">
                                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2.5">
                                    {tags?.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className="text-card-foreground flex items-center gap-1.5 text-xs"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    tagsIds.includes(tag.id) ===
                                                    true
                                                }
                                                onClick={() => {
                                                    if (
                                                        tagsIds.includes(
                                                            tag.id,
                                                        ) === true
                                                    ) {
                                                        const newArray = [];
                                                        for (const entry of tagsIds) {
                                                            if (
                                                                entry !== tag.id
                                                            ) {
                                                                newArray.push(
                                                                    entry,
                                                                );
                                                            }
                                                        }

                                                        setTagsIds(newArray);
                                                    } else {
                                                        tagsIds.push(tag.id);

                                                        const newArray = [];
                                                        for (const entry of tagsIds) {
                                                            newArray.push(
                                                                entry,
                                                            );
                                                        }

                                                        setTagsIds(newArray);
                                                    }
                                                }}
                                                className="focus:outline-ring focus:outline-2"
                                            />
                                            {tag.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ActionButton
                    type="submit"
                    bgColor="bg-primary"
                    color="text-primary-foreground"
                    width="w-auto"
                    margin="mx-auto"
                    content={ad ? "Modifier mon annonce" : "Créer mon annonce"}
                />
            </form>
        </section>
    );
}
