import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.css'],
})
export class CustomerBookingsPage implements OnInit {
    public bookings: any[] = [];

    constructor(private apiService: ApiService) {}

    get user() {
        return this.apiService.user;
    }

    ngOnInit(): void {
        this.getMyBookings();
    }

    async getMyBookings() {
        try {
            const { data, error } = await this.apiService.supabase
                .from('bookings')
                .select('*')
                .eq('booked_for', this.user?.user_metadata['profile'].id);
            if (error) throw error;

            this.bookings = data;
            console.log(data);
        } catch (error: any) {
            console.error(error);
        }
    }
}
