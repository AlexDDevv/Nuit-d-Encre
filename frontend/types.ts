export type TagType = {
    id: number;
    name: string;
};

export type AdType = {
    id: number;
    title: string;
    price: number;
    picture: string;
    description: string;
    owner: string;
    location: string;
    category: CategoryType;
    createdAt: string;
    tags: TagType[];
};

export type AdTypeCard = {
    id: number;
    title: string;
    price: number;
    picture: string;
    tags?: TagType[];
};

export type CategoryType = {
    id: number;
    name: string;
    ads?: AdType[];
};
