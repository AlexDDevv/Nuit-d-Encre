import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CategoryType, TagType, AdType } from "../../types";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../components/CategoryModal";
import { TagModal } from "../components/TagModal";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";
import { queryTags } from "../api/tags";
import { createAd } from "../api/createAd";
import { queryAds } from "../api/ads";
import { queryAd } from "../api/ad";
import { updateAd } from "../api/updateAd";
import styled from "styled-components";
import { Button } from "../components/StyledButton";
import { ImageUp, SquareChevronRight, SquareChevronLeft } from "lucide-react";

const FormSection = styled.div`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 25px;
`;

const TtitleForm = styled.h1`
    color: var(--card-foreground);
    margin-bottom: 50px;
    text-align: center;
`;

const Form = styled.form``;

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-bottom: 30px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Label = styled.label`
    color: var(--card-foreground);
    font-size: 14px;
`;

export const Input = styled.input`
    background-color: var(--input);
    border: none;
    border-radius: 8px;
    color: var(--accent-foreground);
    padding: 10px;
    font-size: 12px;

    &::placeholder {
        opacity: 0.85;
        font-style: italic;
    }

    &:focus {
        outline: 2px solid var(--ring);
    }
`;

const InputFileContainer = styled.div`
    position: relative;
    background-color: var(--input);
    border-radius: 8px;
    width: 100%;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    z-index: 150;

    &:focus {
        outline: 2px solid var(--ring);
    }
`;

const InputFile = styled(Input)`
    height: 100%;
    width: 100%;
    padding: 0;
`;

const CarrouselContainer = styled.div`
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
`;

const Carrousel = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 15px 0;
    overflow: hidden;
`

const ImageAction = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.2s ease-in-out;

    svg {
        color: var(--accent-foreground);
        height: 75px;
        width: 75px;
    }

    p {
        color: var(--accent-foreground);
    }

    &:hover {
        transform: scale(1.05);
    }
`;

const Image = styled.img<{
    isVisible: boolean;
    slideDirection: "left" | "right";
    isExiting: boolean;
}>`
    position: absolute;
    width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 8px;

    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    transform: ${({ isVisible, slideDirection, isExiting }) =>
        isVisible
            ? "translateX(0)"
            : slideDirection === "right"
                ? isExiting
                    ? "translateX(-100%)"
                    : "translateX(100%)"
                : isExiting
                    ? "translateX(100%)"
                    : "translateX(-100%)"}; 

    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
`;


const ArrowBase = styled.div`
    position: absolute;
    width: 50px;
    height: 50px;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
    z-index: 200;

    svg {
        color: var(--accent-foreground);
        width: 100%;
        height: 100%;
        transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

        &:hover {
            color: var(--primary);
            transform: scale(1.05);
        }
    }
`;

const ArrowLeft = styled(ArrowBase)`
    left: 80px;
`;

const ArrowRight = styled(ArrowBase)`
    right: 80px;
`;

const InputsFlex = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
`;

const InputFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 50%;
`;

const TextArea = styled(Input).attrs({ as: "textarea" })`
    font-family: Arial, sans-serif;
    height: 100px;
    resize: none;
`;

const CategoryContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    select {
        width: 75%;
    }
`;

const Select = styled(Input).attrs({ as: "select" })`
    width: 60%;
    cursor: pointer;
`;

const TagsContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    label {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--card-foreground);
        font-size: 12px;
    }

    button {
        margin-top: 10px;
    }
`;

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
    const [picturePreview, setPicturePreview] = useState<string[]>([]);
    const [owner, setOwner] = useState("");
    const [categoryId, setCategoryId] = useState<number>();
    const [tagsIds, setTagsIds] = useState<number[]>([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showTagForm, setShowTagForm] = useState(false);
    const [carrouselIndex, setCarrouselIndex] = useState(0)
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

    useEffect(() => {
        if (ad) {
            setTitle(ad.title);
            setDescription(ad.description);
            setPrice(ad.price);
            setLocation(ad.location);
            setPicture(ad.picture);
            setOwner(ad.owner);
            setCategoryId(ad.category?.id);

            const tagsIds: number[] = [];
            for (const tag of ad.tags) {
                tagsIds.push(tag.id);
            }
            setTagsIds(tagsIds);
        }
    }, [ad]);

    const handleCategoryForm = () => {
        setShowCategoryForm(!showCategoryForm);
    };

    const handleTagForm = () => {
        setShowTagForm(!showTagForm);
    };

    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
    } = useQuery<{ categories: CategoryType[] }>(queryCategories);
    const categories = categoriesData?.categories;

    useEffect(() => {
        if (categories && categories.length && !categoryId) {
            setCategoryId(categories[0].id);
        }
    }, [categories]);

    const {
        data: tagsData,
        loading: tagsLoading,
        error: tagsError,
    } = useQuery<{ tags: TagType[] }>(queryTags);
    const tags = tagsData?.tags;

    const [doCreateAd, { loading: createLoading }] = useMutation<{
        createAd: AdType;
    }>(createAd, {
        refetchQueries: [queryAds],
    });

    const [doUpdateAd, { loading: updateLoading }] = useMutation<{
        updateAd: AdType;
    }>(updateAd, {
        refetchQueries: [queryAds, queryAd],
    });

    const loading = createLoading || updateLoading;

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        const maxFileSize = 2 * 1024 * 1024;
        const validFiles: File[] = [];
        const previews: string[] = [];

        Array.from(files).forEach((file) => {
            if (file.size > maxFileSize) {
                alert(`La taille de l'image ${file.name} dépasse 2 Mo.`);
            } else {
                validFiles.push(file);
                previews.push(URL.createObjectURL(file));
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
                            `Erreur lors de la lecture du fichier ${file.name}`
                        );
                    }
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then((base64Strings) => {
                setPicture((prev) => [...prev, ...base64Strings]);
                setPicturePreview((prev) => [...prev, ...previews]);
            })
            .catch((error) => {
                console.error("Erreur lors de la lecture des fichiers:", error);
            });
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("left");
        setPrevIndex(carrouselIndex)
        setCarrouselIndex((prevIndex) =>
            prevIndex === 0 ? picturePreview.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("right");
        setPrevIndex(carrouselIndex)
        setCarrouselIndex((prevIndex) =>
            prevIndex === picturePreview.length - 1 ? 0 : prevIndex + 1
        );
    };


    const doSubmit = async () => {
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
                navigate(`/ads/${data?.createAd.id}`, { replace: true });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (categoriesLoading) return <p>Loading...</p>;
    if (categoriesError) return <p>Error : {categoriesError.message}</p>;

    if (tagsLoading) return <p>Loading...</p>;
    if (tagsError) return <p>Error : {tagsError.message}</p>;

    return (
        <FormSection>
            <TtitleForm>
                {ad ? "Modifier une annonce" : "Poster une annonce"}
            </TtitleForm>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    doSubmit();
                }}
            >
                <InputsContainer>
                    <InputsFlex>
                        <InputFlex>
                            <InputContainer>
                                <Label htmlFor="title">
                                    Titre de l'annonce
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Ajouter un titre..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </InputContainer>
                            <InputContainer>
                                <Label htmlFor="price">Prix de l'annonce</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Ajouter un prix..."
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(Number(e.target.value))
                                    }
                                />
                            </InputContainer>
                        </InputFlex>
                        <InputFlex>
                            <InputContainer>
                                <Label htmlFor="owner">
                                    Propriétaire de l'annonce
                                </Label>
                                <Input
                                    id="owner"
                                    type="text"
                                    placeholder="Ajouter une adresse mail..."
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                />
                            </InputContainer>
                            <InputContainer>
                                <Label htmlFor="location">
                                    Localisation de l'annonce
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Ajouter une localisation..."
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                />
                            </InputContainer>
                        </InputFlex>
                    </InputsFlex>
                    <InputContainer>
                        <Label htmlFor="description">
                            Description de l'annonce
                        </Label>
                        <TextArea
                            id="description"
                            placeholder="Ajouter une description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></TextArea>
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="picture">Déposer une image</Label>
                        <InputFileContainer
                            onClick={() => {
                                const inputField = document.querySelector(
                                    ".input-field"
                                ) as HTMLInputElement;
                                if (inputField) {
                                    inputField.click();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    const inputField = document.querySelector(
                                        ".input-field"
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
                            <InputFile
                                id="picture"
                                type="file"
                                accept="image/*"
                                hidden
                                multiple
                                className="input-field"
                                onChange={handleImages}
                            />
                            {picturePreview.length > 0 ? (
                                <CarrouselContainer>
                                    <Carrousel>
                                        {picturePreview.map((preview, index) => {
                                            const isVisible = index === carrouselIndex;
                                            const isExiting = index === prevIndex;

                                            return (
                                                <Image
                                                    key={index}
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    isVisible={isVisible}
                                                    isExiting={isExiting}
                                                    slideDirection={slideDirection}
                                                />
                                            );
                                        })}
                                    </Carrousel>
                                </CarrouselContainer>
                            ) : (
                                <ImageAction>
                                    <ImageUp />
                                    <p>Déposez une image ou téléchargez en une</p>
                                </ImageAction>
                            )}
                            {picturePreview.length > 1 && (
                                <>
                                    <ArrowLeft onClick={prevSlide} role="button" aria-label="Previous slide">
                                        <SquareChevronLeft />
                                    </ArrowLeft>
                                    <ArrowRight onClick={nextSlide} role="button" aria-label="Next slide">
                                        <SquareChevronRight />
                                    </ArrowRight>
                                </>
                            )}
                        </InputFileContainer>
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="categories">
                            Sélectionnez une catégorie
                        </Label>
                        <CategoryContainer>
                            <Select
                                id="categories"
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(Number(e.target.value))
                                }
                            >
                                {categories?.map((category: CategoryType) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                minWidth="160px"
                                width="25%"
                                height="35px"
                                transition="background-color 0.2s ease-in-out"
                                backgroundHover="rgba(255, 204, 102, 0.9)"
                                type="button"
                                onClick={handleCategoryForm}
                            >
                                {showCategoryForm
                                    ? "Fermer le formulaire"
                                    : "Ajouter une catégorie"}
                            </Button>
                        </CategoryContainer>

                        {showCategoryForm && (
                            <CategoryModal
                                onCategoryCreated={async (id) => {
                                    setShowCategoryForm(false);
                                    setCategoryId(id);
                                }}
                            />
                        )}
                    </InputContainer>
                    <InputContainer>
                        <Label>Sélectionnez un ou plusieurs tags</Label>
                        <TagsContainer>
                            {tags?.map((tag) => (
                                <Label key={tag.id}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            tagsIds.includes(tag.id) === true
                                        }
                                        onClick={() => {
                                            if (
                                                tagsIds.includes(tag.id) ===
                                                true
                                            ) {
                                                const newArray = [];
                                                for (const entry of tagsIds) {
                                                    if (entry !== tag.id) {
                                                        newArray.push(entry);
                                                    }
                                                }

                                                setTagsIds(newArray);
                                            } else {
                                                tagsIds.push(tag.id);

                                                const newArray = [];
                                                for (const entry of tagsIds) {
                                                    newArray.push(entry);
                                                }

                                                setTagsIds(newArray);
                                            }
                                        }}
                                    />
                                    {tag.name}
                                </Label>
                            ))}
                        </TagsContainer>
                        <Button
                            minWidth="160px"
                            width="25%"
                            height="35px"
                            margin="10px 0 0 auto"
                            transition="background-color 0.2s ease-in-out"
                            backgroundHover="rgba(255, 204, 102, 0.9)"
                            type="button"
                            onClick={handleTagForm}
                        >
                            {showTagForm
                                ? "Fermer le formulaire"
                                : "Ajouter un tag"}
                        </Button>
                        {showTagForm && (
                            <TagModal
                                onTagCreated={async (id) => {
                                    setShowTagForm(false);
                                    tagsIds.push(id);
                                    setTagsIds([...tagsIds]);
                                }}
                            />
                        )}
                    </InputContainer>
                </InputsContainer>
                <Button>
                    {ad ? "Modifier mon annonce" : "Créer mon annonce"}
                </Button>
                {loading === true && <p>Envoi...</p>}
            </Form>
        </FormSection>
    );
}
