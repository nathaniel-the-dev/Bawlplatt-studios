import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BookingsService } from '../bookings.service';
import { ValidateTime } from 'src/app/shared/validators/time.validator';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-booking-form',
    templateUrl: './booking-form.page.html',
    styleUrls: ['./booking-form.page.css']
})
export class BookingFormPage implements OnInit {

    private booking = {} as Booking;
    bookingForm = this.fb.group({
        // Customer type
        customer_type: [null, [Validators.required]],

        // Customer information
        artist: this.fb.group({
            name: [null],
            email: [null],
            contact_num: [null]
        }),
        band: this.fb.group({
            group_name: [null],
            group_size: [null],
            lead_name: [null],
            lead_email: [null],
            lead_contact_num: [null]
        }),

        // Session information
        num_of_instruments: [null],
        start_date: [null],
        start_time: [null, [Validators.required, ValidateTime('08:00', '20:00')]],
        duration: [null],
        message: [null]
    });
    get artistForm(): UntypedFormGroup {
        return this.bookingForm.get('artist') as UntypedFormGroup;
    }
    get bandForm(): UntypedFormGroup {
        return this.bookingForm.get('band') as UntypedFormGroup;
    }

    onFormSubmit(): void {
        // Convert separate date and time to one value
        let start_date = this.bookingForm.controls['start_date'].value && new Date(this.bookingForm.controls['start_date'].value + " " + this.bookingForm.controls['start_time'].value);

        // Add the data to the booking
        Object.assign(this.booking, {
            ...this.bookingForm.value,

            start_date: start_date,
            start_time: undefined
        });

        if (this.artistForm.enabled) {
            const number = (this.artistForm.get('contact_num')!.value as string).toString().replace(/\D/g, '').slice(0, 10);
            this.booking.artist!.contact_num = +number;
        }
        if (this.bandForm.enabled) {
            const number = (this.bandForm.get('lead_contact_num')!.value as string).toString().replace(/\D/g, '').slice(0, 10);
            this.booking.band!.lead_contact_num = +number;
        }

        // Send the corresponding request based on the action
        if (this.action === 'add') {
            const addBookingSub = this.bookingsService.createBooking(this.booking).subscribe((res) => {
                if (res.status === 'success') {
                    this.router.navigateByUrl('/dashboard/bookings');
                    this.toastService.createToast('Booking Created', 'A new session was booked successfully');

                }

                if (res.status === 'fail' && res.error!.type === 'ValidationError')
                    this.errorService.handleValidationError(res, this.bookingForm);

            });
            this.subscriptions.add(addBookingSub);
        } else {
            const updateBookingSub = this.bookingsService.updateBooking(this.booking).subscribe((res) => {
                if (res.status === 'success') {
                    this.router.navigateByUrl('/dashboard/bookings');
                    this.toastService.createToast('Booking Created', 'A new session was booked successfully');

                }
                if (res.status === 'fail' && res.error!.type === 'ValidationError')
                    this.errorService.handleValidationError(res, this.bookingForm);

            });
            this.subscriptions.add(updateBookingSub);
        }
    }

    public action: 'add' | 'edit' = 'add';
    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService, private errorService: ErrorService, private toastService: ToastService, private fb: UntypedFormBuilder, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Set initial form states
        this._setFormState(this.artistForm, 'disabled');
        this._setFormState(this.bandForm, 'disabled');

        // Change customer type form
        const watchSub = this.bookingForm.valueChanges.subscribe((data) => {
            if (data['customer_type'] === 'artist') {
                this._setFormState(this.artistForm, 'enabled');
                this._setFormState(this.bandForm, 'disabled');
            }

            if (data['customer_type'] === 'band') {
                this._setFormState(this.bandForm, 'enabled');
                this._setFormState(this.artistForm, 'disabled');
            }
        });
        this.subscriptions.add(watchSub);


        // Get booking data if attempting to edit
        let id = this.route.snapshot.params['id'];
        if (id) this.getBookingFromParams(id);

    }

    private getBookingFromParams(id: string) {
        // Get booking data
        const bookingSub = this.bookingsService.getBookingById(id).subscribe(res => {
            // Populate fields with provided data and enable required forms
            this.booking = res.data!['booking'];


            if (this.booking.customer_type === 'artist') {
                this._populateValues(this.artistForm, this.booking.artist);
                this._setFormState(this.artistForm, 'enabled');
            }

            if (this.booking.customer_type === 'band') {
                this._populateValues(this.bandForm, this.booking.band);
                this._setFormState(this.bandForm, 'enabled');
            }

            this._populateValues(this.bookingForm, this.booking);

            // Switch action to 'edit'
            this.action = 'edit';
        });

        this.subscriptions.add(bookingSub);
    }

    private _setFormState(form: UntypedFormGroup, state: "enabled" | 'disabled') {
        state === 'enabled' ? form.enable({ emitEvent: false }) : form.disable({ emitEvent: false });
    }
    private _populateValues(form: UntypedFormGroup, data: any) {
        const keys = Object.keys(data);
        const obj: any = {};

        Object.keys(form.value).forEach(control => {
            if (keys.includes(control)) obj[control] = data[control];
            else obj[control] = null;
        });

        if (obj.start_date) {
            obj.start_time = new Date(obj.start_date).toISOString().split('T')[1].slice(0, 5);
            obj.start_date = new Date(obj.start_date).toISOString().split('T')[0];
        }

        form.patchValue(obj);
    }
}
