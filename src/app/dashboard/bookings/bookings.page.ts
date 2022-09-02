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
    loading: boolean = false;

    // Searching
    isSearching: boolean = false;
    searchQuery: string = '';
    search(): void {
        this.filterOpts.search = this.searchQuery;
        this.isSearching = !!this.searchQuery;
        this.getAllBookings();
    }

    // Pagination
    page: number = 1;
    totalPages: number = 0;
    changePage(dir: -1 | 1): void {
        const newPage = this.page + dir;
        this.page = dir === -1 ? Math.max(0, newPage) : Math.min(this.totalPages, newPage);

        this.filterOpts.page = this.page;
        this.getAllBookings();
    }

    // QueryOptions
    filterOpts: QueryOptions = {
        group: 'incomplete',

        page: 1,
        limit: 5
    };

    // Accordion options
    selectedListItem?: number;
    toggleItemDetails(index: number): void {
        this.selectedListItem = index !== this.selectedListItem ? index : undefined;
    }

    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService) { }

    ngOnInit(): void {
        this.getAllBookings();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getAllBookings() {
        this.loading = true;
        const bookingsSub = this.bookingsService.getAllBookings(this.filterOpts).subscribe((res) => {
            if (res.status === 'success') {
                this.bookings = res.data!['bookings'];
                this.totalPages = (res.data!['page'] as any).maxNumOfPages;
            }

            this.loading = false;
        });
        this.subscriptions.add(bookingsSub);
    }

    toggleBookingValue(id: string, field: 'completed' | 'payed', value: boolean = true): void {
        const data = {} as any;
        data[field] = value;

        const toggleSub = this.bookingsService.approveBooking(id, data).subscribe((res) => {
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
