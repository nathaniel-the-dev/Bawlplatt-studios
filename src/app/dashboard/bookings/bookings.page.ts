import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { Booking } from 'src/app/shared/booking';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.css']
})
export class BookingsPage implements OnInit {
    bookings: Booking[] = []

    constructor(private bookingsService: BookingsService) { }

    ngOnInit(): void {
        this.bookingsService.getAllBookings().subscribe((res) => {
            if (res.status === 'success') this.bookings = res.data!['bookings'];
        })
    }

}
