import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QueryOptions } from 'src/app/shared/models/api-response';
import { Booking } from 'src/app/shared/models/booking';
import { BookingsService } from '../bookings/bookings.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.css']
})
export class HistoryPage implements OnInit, OnDestroy {
    bookings: Booking[] = [];

    filterOpts: QueryOptions = {
        group: 'complete'
    };

    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService) { }

    ngOnInit(): void {
        this.getCompleteBookings();
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getCompleteBookings(): void {
        const bookingSub = this.bookingsService.getAllBookings(this.filterOpts).subscribe(res => {
            if (res.status !== 'success') return;

            this.bookings = res.data!['bookings'];
        });
        this.subscriptions.add(bookingSub);
    }


}
