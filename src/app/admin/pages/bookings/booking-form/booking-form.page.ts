import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking';
import { ValidateTime } from 'src/app/shared/validators/time.validator';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-booking-form',
    templateUrl: './booking-form.page.html',
    styleUrls: ['./booking-form.page.css'],
})
export class BookingFormPage implements OnInit, OnDestroy {
    private booking: Partial<Booking> = {};

    public bookingForm = this.fb.group({
        // Customer type
        customer_type: [null, [Validators.required]],
        booked_for: [null],

        // Session information
        date_booked: [null],
        time_booked: [null, [ValidateTime('08:00', '20:00')]],
        duration_in_minutes: [null],

        // Requirements
        num_of_musicians: [null],
        equipment_needed: [null], // Format: {drums: 2, guitar: 1}
        additional_requirements: [null],
    });

    public customer_types: any[] = [];
    public customers: any[] = [];

    public action: 'add' | 'edit' = 'add';
    private subscriptions = new Subscription();

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Get customer types
        this.apiService
            .sendRequest({
                method: 'select',
                table: 'customer_type',
            })
            .then((res) => {
                if (res.data) this.customer_types = res.data;
            });

        // Get customers
        this.apiService
            .sendRequest({
                method: 'select',
                table: 'profiles',
                sql: 'id, name, avatar, roles!inner(title)',
                data: {
                    where: {
                        field: 'roles.title',
                        // value: 'customer',
                        value: 'admin',
                    },
                },
            })
            .then((res) => {
                this.customers = res.data;
            });

        // Get booking data if attempting to edit
        let id = this.route.snapshot.params['id'];
        if (id) this.getBookingFromParams(id);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public async onFormSubmit(): Promise<void> {
        // if (this.bookingForm.invalid) return;

        // Add the data to the booking
        Object.assign(this.booking, {
            ...this.bookingForm.value,
        });

        // ! Remove later
        const mockBooking = {
            customer_type: 1,
            booked_for: 2,

            // Session information
            date_booked: '2024-04-30',
            time_booked: '08:00:00',
            duration_in_minutes: 60,

            // Requirements
            num_of_musicians: 3,
            equipment_needed: { drums: 2, guitar: 1 },
            additional_requirements: 'Make sure autotune and reverb are on.',
        };

        // Send the corresponding request based on the action
        if (this.action === 'add') {
            const res = await this.apiService.sendRequest({
                method: 'insert',
                table: 'bookings',
                data: mockBooking,
            });
            if (res.status === 'success') {
                this.router.navigateByUrl('/admin/bookings');
                this.toastService.createToast(
                    'Booking Created',
                    'A new session was booked successfully'
                );
            }
        }
        // else {
        //     const updateBookingSub = this.apiService
        //         .updateBooking(this.booking)
        //         .subscribe((res) => {
        //             if (res.status === 'success') {
        //                 this.router.navigateByUrl('/dashboard/bookings');
        //                 this.toastService.createToast(
        //                     'Booking Created',
        //                     'A new session was booked successfully'
        //                 );
        //             }
        //             if (
        //                 res.status === 'fail' &&
        //                 res.error!.type === 'ValidationError'
        //             )
        //                 this.errorService.handleValidationError(
        //                     res,
        //                     this.bookingForm
        //                 );
        //         });
        //     this.subscriptions.add(updateBookingSub);
        // }
    }

    private getBookingFromParams(id: string) {
        // Get booking data
        // const bookingSub = this.apiService
        //     .getBookingById(id)
        //     .subscribe((res) => {
        //         // Populate fields with provided data and enable required forms
        //         this.booking = res.data!['booking'];
        //         if (this.booking.customer_type === 'artist') {
        //             this._populateValues(this.artistForm, this.booking.artist);
        //             this._setFormState(this.artistForm, 'enabled');
        //         }
        //         if (this.booking.customer_type === 'band') {
        //             this._populateValues(this.bandForm, this.booking.band);
        //             this._setFormState(this.bandForm, 'enabled');
        //         }
        //         this._populateValues(this.bookingForm, this.booking);
        //         // Switch action to 'edit'
        //         this.action = 'edit';
        //     });
        // this.subscriptions.add(bookingSub);
    }

    private _populateValues(form: FormGroup, data: any) {
        const keys = Object.keys(data);
        const obj: any = {};

        Object.keys(form.value).forEach((control) => {
            if (keys.includes(control)) obj[control] = data[control];
            else obj[control] = null;
        });

        if (obj.start_date) {
            obj.start_time = new Date(obj.start_date)
                .toISOString()
                .split('T')[1]
                .slice(0, 5);
            obj.start_date = new Date(obj.start_date)
                .toISOString()
                .split('T')[0];
        }

        form.patchValue(obj);
    }
}
