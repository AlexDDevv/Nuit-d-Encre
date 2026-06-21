export interface CategoryBook {
    id: string;
    name: string;
}

export type GetCategoriesQuery = {
    categories: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    }[];
};
