import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QueryOptions } from 'src/app/shared/models/api-response';
import { Booking } from 'src/app/shared/models/booking';
import { BookingsService } from './bookings.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.css']
})
export class BookingsPage implements OnInit, OnDestroy {
    bookings: Booking[] = [];

    filterOpts: QueryOptions = {
        filter: { key: 'completed', value: 'false' }
    };

    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService) { }

    ngOnInit(): void {
        this.getAllBookings();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getAllBookings() {
        const bookingsSub = this.bookingsService.getAllBookings(this.filterOpts).subscribe((res) => {
            if (res.status === 'success') this.bookings = res.data!['bookings'];
        });
        this.subscriptions.add(bookingsSub);
    }

    toggleBookingValue(id: string, field: 'completed' | 'payed', value: boolean | string = true): void {
        const data = {} as any;
        data[field] = value;

        const toggleSub = this.bookingsService.switchBookingValue(id, data).subscribe((res) => {
            if (res.status === 'success') this.getAllBookings();
        });
        this.subscriptions.add(toggleSub);
    }

    deleteBooking(id: string): void {
        let confimation = window.confirm('Are you sure you want to delete this booking?');
        if (!confimation) return;

        const deleteSub = this.bookingsService.deleteBooking(id).subscribe((res) => {
            if (res === null) this.getAllBookings();
        });
        this.subscriptions.add(deleteSub);
    }
}
