import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-booking-details',
    templateUrl: './booking-details.page.html',
    styleUrls: ['./booking-details.page.css'],
})
export class BookingDetailsPage implements OnInit {
    public booking: any;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.getBookingInformation(id);
        } else {
            this.router.navigateByUrl('/admin/bookings');
        }
    }

    private async getBookingInformation(id: string) {
        const { data: booking } = await this.apiService.supabase
            .from('bookings')
            .select('*, customer_type(name), booked_for(name,avatar)')
            .eq('id', id)
            .maybeSingle();

        if (booking) this.booking = booking;
        else this.router.navigateByUrl('/404');
    }
}
