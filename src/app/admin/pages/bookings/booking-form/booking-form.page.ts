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
        customer_type: [null as string | null, [Validators.required]],
        booked_for: [null as string | null, [Validators.required]],

        // Session information
        date_booked: [null as string | null, [Validators.required]],
        time_booked: [
            null as string | null,
            [Validators.required, ValidateTime('08:00', '20:00')],
        ],
        duration_in_minutes: [null as string | null, [Validators.required]],

        // Requirements
        num_of_musicians: [null as string | null, [Validators.required]],
        equipment_needed: [{} as Partial<typeof this.equipment_available>], // Format: {drums: 2, guitar: 1}
        additional_requirements: [null as string | null],
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

    // Form settings
    public customer_types: any[] = [];
    public customers: any[] = [];
    public durations = [
        { value: 30, label: '30 mins.' },
        { value: 60, label: '1 hr.' },
        { value: 120, label: '2 hrs.' },
        { value: 180, label: '3 hrs.' },
        { value: 240, label: '4 hrs.' },
    ];
    public equipment_available = {
        guitars: 3,
        drums: 2,
        pianos: 2,
        bass: 1,
        microphones: 5,
    };

    get minDate() {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }

    public action: 'add' | 'edit' = 'add';
    private bookingId?: string;

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Set form options
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

    getEquipmentValue(key: string) {
        let label = key as keyof typeof this.equipment_available;
        return this.bookingForm.controls.equipment_needed.value?.[label] || 0;
    }

    updateEquipmentValue(key: string, value: number) {
        const control = this.bookingForm.controls.equipment_needed;

        control.setValue({
            ...control.value,
            [key]: Math.min(
                Math.max((this.getEquipmentValue(key) || 0) + value, 0),
                this.equipment_available[
                    key as keyof typeof this.equipment_available
                ]
            ),
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

        // Send the corresponding request based on the action
        if (this.action === 'add') await this.createBooking();
        if (this.action === 'edit') await this.updateBooking();
    }

    private async createBooking() {
        const res = await this.apiService.supabase
            .from('bookings')
            .insert([this.bookingForm.value]);

        if (res.status === 201) {
            this.router.navigateByUrl('/admin/bookings');
            this.toastService.createToast(
                'Booking Created',
                'A new session was booked successfully'
            );
        }
    }

    private async updateBooking() {
        // Update booking
        const res = await this.apiService.supabase
            .from('bookings')
            .update(this.bookingForm.value)
            .eq('id', this.bookingId);

        if (res.status === 204) {
            this.router.navigateByUrl('/admin/bookings');
            this.toastService.createToast(
                'Booking Updated',
                'The session was updated successfully'
            );
        }
    }

    private async getBookingFromParams(id: string) {
        // Get booking data
        const { data: booking } = await this.apiService.supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (!booking) this.router.navigateByUrl('/404');
        else {
            this.bookingId = id;
            this.bookingForm.patchValue(booking);
        }
    }
}
