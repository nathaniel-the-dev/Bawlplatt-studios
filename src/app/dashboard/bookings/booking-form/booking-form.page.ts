import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking';
import { BookingsService } from '../bookings.service';

@Component({
    selector: 'app-booking-form',
    templateUrl: './booking-form.page.html',
    styleUrls: ['./booking-form.page.css']
})
export class BookingFormPage implements OnInit {
    booking = {} as Booking;

    bookingForm = this.fb.group({
        // Customer type
        customerTypeForm: this.fb.group({
            customer_type: [undefined, [Validators.required]]
        }),

        // Customer information
        artistForm: this.fb.group({
            name: [undefined, Validators.required],
            email: [undefined, [Validators.required, Validators.email]],
            contact_num: [undefined, Validators.required]
        }),
        bandForm: this.fb.group({
            group_name: [undefined, Validators.required],
            group_size: [undefined, [Validators.required, Validators.min(1)]],
            lead_name: [undefined, Validators.required],
            lead_email: [undefined, [Validators.required, Validators.email]],
            lead_contact_num: [undefined, Validators.required]
        }),

        // Session information
        sessionForm: this.fb.group({
            num_of_instruments: [undefined, Validators.min(0)],
            start_date: [undefined, Validators.required],
            start_time: [undefined, Validators.required],
            duration: [undefined, [Validators.required, Validators.max(4)]],
            message: [undefined, Validators.maxLength(255)]
        })
    })
    get customerTypeForm(): FormGroup {
        return this.bookingForm.get('customerTypeForm') as FormGroup;
    }
    get artistForm(): FormGroup {
        return this.bookingForm.get('artistForm') as FormGroup;
    }
    get bandForm(): FormGroup {
        return this.bookingForm.get('bandForm') as FormGroup;
    }
    get sessionForm(): FormGroup {
        return this.bookingForm.get('sessionForm') as FormGroup;
    }

    private _setFormState(form: FormGroup, state: "enabled" | 'disabled') {
        state === 'enabled' ? form.enable() : form.disable();
    }

    onCustomerTypeFormSubmit(): void {
        let customer_type = this.customerTypeForm.controls['customer_type'].value;

        if (customer_type === 'artist') {
            this._setFormState(this.artistForm, 'enabled');
            this._setFormState(this.bandForm, 'disabled');
        }

        if (customer_type === 'band') {
            this._setFormState(this.bandForm, 'enabled');
            this._setFormState(this.artistForm, 'disabled');
        }
    }
    onCustomerInfoFormSubmit(): void {
        this._setFormState(this.sessionForm, 'enabled');
    }
    onSessionFormSubmit(): void {
        // Convert separate date and time to one value
        let start_date = new Date(this.sessionForm.controls['start_date'].value + " " + this.sessionForm.controls['start_time'].value);

        // Add the data to the booking
        Object.assign(this.booking, {
            ...this.customerTypeForm.value,

            artist: this.artistForm.enabled ? (this.artistForm.value) : undefined,
            band: this.bandForm.enabled ? (this.bandForm.value) : undefined,

            ...this.sessionForm.value,
            start_date: start_date,
            start_time: undefined
        });

        // Send the corresponding request based on the action
        if (this.action === 'add') {
            const addBookingSub = this.bookingsService.createBooking(this.booking).subscribe((res) => {
                if (res.status !== 'success') return;

                this.router.navigateByUrl('/dashboard/bookings');
            });
            this.subscriptions.add(addBookingSub);
        } else {
            const updateBookingSub = this.bookingsService.updateBooking(this.booking).subscribe((res) => {
                if (res.status !== 'success') return;

                this.router.navigateByUrl('/dashboard/bookings');
            });
            this.subscriptions.add(updateBookingSub);
        }
    }


    public action: 'add' | 'edit' = 'add';
    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Set initial form states
        this._setFormState(this.artistForm, 'disabled');
        this._setFormState(this.bandForm, 'disabled');
        this._setFormState(this.sessionForm, 'disabled');


        // Get booking data if attempting to edit
        let id = this.route.snapshot.params['id'];
        if (id) this.getBookingFromParams(id);

    }

    private getBookingFromParams(id: string) {
        // Get booking data
        const bookingSub = this.bookingsService.getBookingById(id).subscribe(res => {
            // Populate fields with provided data and enable required forms
            this.booking = res.data!['booking'];

            this.populateValues(this.customerTypeForm, this.booking);

            if (this.booking.customer_type === 'artist') {
                this.populateValues(this.artistForm, this.booking.artist);
                this._setFormState(this.artistForm, 'enabled');
            }

            if (this.booking.customer_type === 'band') {
                this.populateValues(this.bandForm, this.booking.band);
                this._setFormState(this.bandForm, 'enabled');
            }

            this.populateValues(this.sessionForm, this.booking);
            this._setFormState(this.sessionForm, 'enabled');

            // Switch action to 'edit'
            this.action = 'edit';
        });

        this.subscriptions.add(bookingSub);
    }

    private populateValues(form: FormGroup, data: any) {
        const keys = Object.keys(data);
        const obj: any = {};

        Object.keys(form.value).forEach(control => {
            if (keys.includes(control)) obj[control] = data[control];
        });

        if (obj.start_date) {
            obj.start_time = new Date(obj.start_date).toISOString().split('T')[1].slice(0, 5);
            obj.start_date = new Date(obj.start_date).toISOString().split('T')[0];
        }

        form.setValue(obj);
    }
}
