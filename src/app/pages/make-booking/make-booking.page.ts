import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/dashboard/bookings/bookings.service';
import { Router } from '@angular/router';
import { Booking } from 'src/app/shared/models/booking';

@Component({
    selector: 'app-make-booking',
    templateUrl: './make-booking.page.html',
    styleUrls: ['./make-booking.page.css']
})
export class MakeBookingPage implements OnInit, OnDestroy {
    bookingForm = this.fb.group({
        customerTypeForm: this.fb.group({
            customer_type: [undefined, [Validators.required]],
        }),

        artistForm: this.fb.group({
            name: [undefined, [Validators.required]],
            email: [undefined, [Validators.required, Validators.email]],
            contact_num: [undefined, [Validators.required]]
        }),

        bandForm: this.fb.group({
            group_name: [undefined, [Validators.required]],
            group_size: [undefined, [Validators.required, Validators.min(1)]],
            lead_name: [undefined, [Validators.required]],
            lead_email: [undefined, [Validators.required, Validators.email]],
            lead_contact_num: [undefined, [Validators.required]]
        }),

        sessionForm: this.fb.group({
            num_of_instruments: [undefined, [Validators.min(0)]],
            start_date: [undefined, Validators.required],
            start_time: [undefined, Validators.required],
            duration: [undefined, [Validators.required, Validators.max(4)]],
            message: [undefined, Validators.maxLength(255)]
        })
    });
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

    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService, private fb: FormBuilder, private router: Router) { }

    ngOnInit(): void {
        this._setFormState(this.artistForm, 'disabled');
        this._setFormState(this.bandForm, 'disabled');
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    activeSlide: string = 'customerType';
    changeSlide(slide: 'customerType' | 'artist' | 'band' | 'session' | 'complete'): void {
        switch (slide) {
            case 'artist':
                this._setFormState(this.artistForm, 'enabled');
                this._setFormState(this.bandForm, 'disabled');
                break;
            case 'band':
                this._setFormState(this.bandForm, 'enabled');
                this._setFormState(this.artistForm, 'disabled');
                break;
        }

        this.activeSlide = slide;
    }

    onBookingFormSubmit(): void {
        // Convert separate date and time to one value
        let start_date = new Date(this.sessionForm.controls['start_date'].value + " " + this.sessionForm.controls['start_time'].value);

        // Add the data to the booking
        const booking =
            {
                ...this.customerTypeForm.value,

                artist: this.artistForm.enabled ? (this.artistForm.value) : undefined,
                band: this.bandForm.enabled ? (this.bandForm.value) : undefined,

                ...this.sessionForm.value,
                start_date: start_date,
                start_time: undefined
            } as Booking;

        const bookingSub = this.bookingsService.createBooking(booking).subscribe((res) => {
            if (res.status !== 'success') return;

            this.changeSlide('complete');
        });
        this.subscriptions.add(bookingSub);
    }


    private _setFormState(form: FormGroup, state: 'enabled' | 'disabled'): void {
        state === 'enabled' ? form.enable() : form.disable();
    }
}
