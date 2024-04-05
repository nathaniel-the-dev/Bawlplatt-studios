import { User } from "./user";

interface Band {
    group_name: string;
    group_size: number;

    lead_name: string;
    lead_email: string;
    lead_contact_num: number;
}

interface Artist {
    name: string;
    email: string;
    contact_num: number;
}

export interface Booking {
    _id: string;

    band?: Band;
    artist?: Artist;
    customer_type: 'band' | 'artist';

    num_of_instruments: number;

    start_date: Date;
    duration: number;

    message?: string;

    cost: number;
    completed: boolean;
    payed: boolean;

    approved_by?: User;

    booked_at: Date;
    last_updated: Date;

    [key: string]: any | undefined;
}