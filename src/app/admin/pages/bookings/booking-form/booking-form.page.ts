import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateTime } from 'src/app/shared/validators/time.validator';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

type FormErrors = Record<
    keyof Omit<
        (typeof BookingFormPage.prototype.bookingForm)['controls'],
        'id'
    >,
    string
>;

@Component({
    selector: 'app-booking-form',
    templateUrl: './booking-form.page.html',
    styleUrls: ['./booking-form.page.css'],
})
export class BookingFormPage implements OnInit {
    @ViewChild('form') formRef?: FormGroupDirective;

    public bookingForm = this.fb.group({
        // Customer type
        customer_type: [null, [Validators.required]],
        booked_for: [null, [Validators.required]],

        // Session information
        date_booked: [null, [Validators.required]],
        time_booked: [
            null,
            [Validators.required, ValidateTime('08:00', '20:00')],
        ],
        duration_in_minutes: [null, [Validators.required]],

        // Requirements
        num_of_musicians: [null, [Validators.required]],
        equipment_needed: [null], // Format: {drums: 2, guitar: 1}
        additional_requirements: [null],
    });

    public errors: FormErrors = {
        customer_type: '',
        booked_for: '',
        date_booked: '',
        time_booked: '',
        duration_in_minutes: '',
        num_of_musicians: '',
        equipment_needed: '',
        additional_requirements: '',
    };

    public customer_types: any[] = [];
    public customers: any[] = [];

    public action: 'add' | 'edit' = 'add';

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.setFormOptions();

        // Get booking data if attempting to edit
        let id = this.route.snapshot.params['id'];
        if (id) {
            this.action = 'edit';
            this.getBookingFromParams(id);
        }

        // Validate fields when input changes
        this.validatorService.validateOnInput(
            this.bookingForm,
            (errors) => {
                this.errors = errors;
            },
            this.formRef
        );
    }

    private setFormOptions() {
        // Get customer types
        this.apiService.supabase
            .from('customer_type')
            .select('*')
            .then(({ data }) => {
                if (data) this.customer_types = data;
            });

        // Get customers
        this.apiService.supabase
            .from('profiles')
            .select('id, name, avatar, active, role:roles!inner(title)')
            .in('role.title', ['admin', 'customer'])
            .eq('active', true)
            .then(({ data }) => {
                if (data) this.customers = data;
            });
    }

    public async onFormSubmit(): Promise<void> {
        const formResponse = this.validatorService.validate<
            typeof this.bookingForm
        >(this.bookingForm, this.formRef);

        if (!formResponse.valid) {
            this.errors = formResponse.errors;
            return;
        }

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
        if (this.action === 'add') await this.createBooking();
        if (this.action === 'edit') await this.updateBooking();
    }

    private async createBooking() {
        const res = await this.apiService.supabase
            .from('bookings')
            .insert(this.bookingForm.value);
        if (res.status === 200) {
            this.router.navigateByUrl('/admin/bookings');
            this.toastService.createToast(
                'Booking Created',
                'A new session was booked successfully'
            );
        }
    }

    private async updateBooking() {
        // TODO : Update booking
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
