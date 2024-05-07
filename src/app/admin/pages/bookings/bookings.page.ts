import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.css'],
})
export class BookingsPage implements OnInit {
    bookings: Booking[] = [];
    loading: boolean = false;

    // Searching
    isSearching: boolean = false;
    searchQuery: string = '';
    search(): void {
        this.pagination.current = 1;
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
    public pagination = {
        current: 1,
        max: 1,
        limit: 5,
    };

    public changePage(page: any) {
        this.pagination.current = page;
        this.getAllBookings();
    }

    // QueryOptions
    filterOpts: any = {
        group: 'incomplete',

        page: 1,
        limit: 4,

        sort: {
            key: 'booked_at',
            value: 'desc',
        },
    };

    constructor(
        private apiService: ApiService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.getAllBookings();
    }

    private async getAllBookings() {
        this.loading = true;
        const query = this.apiService.supabase
            .from('bookings')
            .select('*, customer_type(name), booked_for!inner(name)');
        if (this.searchQuery) {
            query.textSearch('booked_for.name', this.searchQuery);
        }

        const { data } = await this.apiService.paginateQuery(
            query,
            this.pagination
        );
        this.loading = false;

        if (data) {
            this.bookings = data;
        }
    }

    async deleteBooking(id: number): Promise<void> {
        const confirmation = await this.toastService.openConfirmDeleteModal({
            title: 'Are you sure you want to delete this booking?',
            text: `This action cannot be undone.`,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'No',
        });

        if (!confirmation) return;

        // Delete booking
        const { error } = await this.apiService.supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (!error) {
            this.toastService.createToast(
                'Success',
                'Booking removed successfully',
                'success'
            );

            this.getAllBookings();
        } else {
            this.toastService.createToast(
                'Error',
                'There was an error deleting the booking',
                'error'
            );
        }
    }
}
