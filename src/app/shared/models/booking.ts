import { User } from './user';

export interface Booking {
    id: number;

    customer_type?: { name: 'band' | 'artist' };
    status: string;

    date_booked: Date;
    time_booked: Date;
    duration_in_minutes: number;

    num_of_musicians: number;
    equipment_needed: any;
    additional_requirements?: string;

    booked_by?: User;
    approved_by?: User;

    transaction: any;

    created_at: Date;
}
