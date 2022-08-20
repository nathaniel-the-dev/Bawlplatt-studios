interface Band {
    band_name: string;
}

export interface Booking {
    _id: string;

    band: Band;
    group_size: number;
}