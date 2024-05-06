import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.css'],
})
export class HistoryPage implements OnInit, OnDestroy {
    bookings: Booking[] = [];

    filterOpts = {
        group: 'complete',

        sort: {
            key: 'start_date',
            value: 'desc',
        },
    };

    private subscriptions = new Subscription();

    constructor(
        private apiService: ApiService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.getCompleteBookings();
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getCompleteBookings(): void {
        // const bookingSub = this.apiService
        //     .getAllBookings(this.filterOpts)
        //     .subscribe((res) => {
        //         if (res.status !== 'success') return;
        //         this.bookings = res.data!['bookings'];
        //     });
        // this.subscriptions.add(bookingSub);
    }

    deleteBooking(booking: Booking): void {
        this.toastService
            .openConfirmDeleteModal({
                title: 'Are you sure you want to delete this booking?',
                text: `This action cannot be undone.`,
                confirmButtonText: 'Yes, delete',
                cancelButtonText: 'No',
            })
            .then((confirmation: boolean) => {
                if (!confirmation) return;

                // const sub = this.apiService
                //     .deleteBooking(booking._id)
                //     .subscribe((res) => {
                //         if (res === null) this.getCompleteBookings();
                //     });
                // this.subscriptions.add(sub);
            });
    }
}
