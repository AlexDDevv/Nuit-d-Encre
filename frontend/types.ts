export type TagType = {
    id: number;
    name: string;
};

export type AdType = {
    id: number;
    title: string;
    price: number;
    picture: string[];
    description: string;
    owner: string;
    location: string;
    category: CategoryType;
    createdBy: UserType;
    createdAt: string;
    tags: TagType[];
};

export type AdTypeCard = {
    id: number;
    owner?: string;
    title: string;
    price: number;
    picture: string;
    category: CategoryType;
    tags?: TagType[];
};

export type CategoryType = {
    id: number;
    name: string;
    ads?: AdType[];
};

export type UserType = {
    id: number;
    email: string;
};
