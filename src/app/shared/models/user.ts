export interface User {
    _id: string;

    name: string;
    email: string;
    photo: string;

    active: boolean;

    created_at: string;
    last_updated: string;
}