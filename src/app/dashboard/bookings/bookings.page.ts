import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking';
import { BookingsService } from './bookings.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.css']
})
export class BookingsPage implements OnInit, OnDestroy {
    bookings: Booking[] = [];

    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService) { }

    ngOnInit(): void {
        this.getAllBookings();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getAllBookings() {
        const bookingsSub = this.bookingsService.getAllBookings().subscribe((res) => {
            if (res.status === 'success') this.bookings = res.data!['bookings'];
        });
        this.subscriptions.add(bookingsSub);
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
