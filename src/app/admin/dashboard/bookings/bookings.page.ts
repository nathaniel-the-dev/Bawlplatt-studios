import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QueryOptions } from 'src/app/admin/shared/models/api-response';
import { Booking } from 'src/app/admin/shared/models/booking';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.css'],
})
export class BookingsPage implements OnInit, OnDestroy {
    bookings: Booking[] = [];
    loading: boolean = false;

    // Searching
    isSearching: boolean = false;
    searchQuery: string = '';
    search(): void {
        this.isSearching = !!this.searchQuery;

        this.filterOpts.search = this.searchQuery;
        this.filterOpts.page = 1;
        this.getAllBookings();
    }

    // Filtering
    selectedFilter: string = '';
    filterList() {
        if (!this.selectedFilter || this.selectedFilter === 'none')
            delete this.filterOpts.filter;
        else {
            const filter = this.selectedFilter.split('=');

            this.filterOpts.filter = {
                key: filter[0],
                value: filter[1],
            };
        }

        this.getAllBookings();
    }

    // Pagination
    page: number = 1;
    totalPages: number = 0;
    changePage(dir: -1 | 1): void {
        const newPage =
            dir === -1
                ? Math.max(0, this.page + dir)
                : Math.min(this.totalPages, this.page + dir);

        this.filterOpts.page = newPage;
        this.getAllBookings();
    }

    // QueryOptions
    filterOpts: QueryOptions = {
        group: 'incomplete',

        page: 1,
        limit: 4,

        sort: {
            key: 'booked_at',
            value: 'desc',
        },
    };

    // Accordion options
    selectedListItem?: number;
    toggleItemDetails(index: number): void {
        this.selectedListItem =
            index !== this.selectedListItem ? index : undefined;
    }

    private subscriptions = new Subscription();

    constructor(
        private apiService: ApiService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.getAllBookings();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private async getAllBookings() {
        this.loading = true;

        const data = await this.apiService.sendRequest({
            table: 'bookings',
            method: 'select',
            data: this.filterOpts,
        });

        this.loading = false;

        if (data) {
            console.log(data);
            // this.bookings = res.data!['bookings'];
            // this.totalPages = (res.data!['page'] as any).maxNumOfPages;
            // this.page = (res.data!['page'] as any).current;
        }
    }

    toggleBookingValue(
        id: string,
        field: 'completed' | 'payed',
        value: boolean = true
    ): void {
        const data = {} as any;
        data[field] = value;

        // const toggleSub = this.apiService
        //     .approveBooking(id, data)
        //     .subscribe((res) => {
        //         if (res.status === 'success') this.getAllBookings();
        //     });
        // this.subscriptions.add(toggleSub);
    }

    deleteBooking(id: string): void {
        this.toastService
            .openConfirmDeleteModal()
            .then((confirmation: boolean) => {
                if (!confirmation) return;

                // const deleteSub = this.apiService
                //     .deleteBooking(id)
                //     .subscribe((res) => {
                //         if (res === null) {
                //             this.getAllBookings();
                //             this.selectedListItem = undefined;
                //         }
                //     });
                // this.subscriptions.add(deleteSub);
            });
    }
}
