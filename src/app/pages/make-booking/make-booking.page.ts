import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/dashboard/bookings/bookings.service';
import { Router } from '@angular/router';
import { Booking } from 'src/app/shared/models/booking';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ValidateTime } from 'src/app/shared/validators/time.validator';

@Component({
    selector: 'app-make-booking',
    templateUrl: './make-booking.page.html',
    styleUrls: ['./make-booking.page.css']
})
export class MakeBookingPage implements OnInit, OnDestroy {
    bookingForm = this.fb.group({
        customer_type: [null, [Validators.required]],

        artist: this.fb.group({
            name: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            contact_num: [null, [Validators.required, Validators.pattern(/^([0-9]{1,})$/)]]
        }),

        band: this.fb.group({
            group_name: [null, [Validators.required]],
            group_size: [null, [Validators.required, Validators.min(1)]],
            lead_name: [null, [Validators.required]],
            lead_email: [null, [Validators.required, Validators.email]],
            lead_contact_num: [null, [Validators.required, Validators.pattern(/^([0-9]{1,})$/)]]
        }),

        num_of_instruments: [null, Validators.min(0)],
        start_date: [null, Validators.required],
        start_time: [null, [Validators.required, ValidateTime('08:00', '20:00')]],
        duration: [null, [Validators.required, Validators.max(4)]],
        message: [null, Validators.maxLength(255)]
    });
    get artistForm(): FormGroup {
        return this.bookingForm.get('artist') as FormGroup;
    }
    get bandForm(): FormGroup {
        return this.bookingForm.get('band') as FormGroup;
    }

    private subscriptions = new Subscription();

    constructor(private bookingsService: BookingsService, private errorService: ErrorService, private fb: FormBuilder, private router: Router) { }

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
        let start_date = this.bookingForm.controls['start_date'].value && new Date(this.bookingForm.controls['start_date'].value + " " + this.bookingForm.controls['start_time'].value);

        // Add the data to the booking
        const booking = {
            ...this.bookingForm.value,

            start_date: start_date,
            start_time: undefined
        } as Booking;

        const bookingSub = this.bookingsService.createBooking(booking).subscribe((res) => {
            if (res.status === 'success') this.changeSlide('complete');
            if (res.status === 'fail' && res.error!.type === 'ValidationError')
                this.errorService.handleValidationError(res, this.bookingForm);
        });
        this.subscriptions.add(bookingSub);
    }


    private _setFormState(form: FormGroup, state: 'enabled' | 'disabled'): void {
        state === 'enabled' ? form.enable({ emitEvent: false }) : form.disable({ emitEvent: false });
    }
}
