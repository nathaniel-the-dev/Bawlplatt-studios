import { User } from './user';

export interface Booking {
    id: number;

    customer_type?: { name: 'band' | 'artist' };
    booked_for?: User;

    date_booked: Date;
    time_booked: Date;
    duration_in_minutes: number;

    num_of_musicians: number;
    equipment_needed: any;
    additional_requirements?: string;

    status: string;
    approved_by?: User;

    transaction: any;

    created_at: Date;
}
