import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateTime } from 'src/app/shared/validators/time.validator';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import {
    AVAILABLE_EQUIPMENT,
    BOOKING_DURATIONS,
    MAX_MUSICIANS_COUNT,
} from 'src/app/shared/config/constants';

type FormErrors = Record<
    keyof Omit<
        (typeof BookingFormPage.prototype.bookingForm)['controls'],
        'id'
    >,
    string
>;

type EquipmentNeeded = Partial<
    Record<
        keyof typeof BookingFormPage.prototype.equipment_available,
        number | undefined
    >
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
        num_of_musicians: [
            null as string | null,
            [Validators.required, Validators.max(MAX_MUSICIANS_COUNT)],
        ],
        equipment_needed: [{} as EquipmentNeeded],
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
    public durations = BOOKING_DURATIONS;
    public equipment_available = AVAILABLE_EQUIPMENT;

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

    getEquipmentLimit(key: string): number {
        let label = key as keyof typeof this.equipment_available;
        return this.bookingForm.controls.equipment_needed.value?.[label] || 0;
    }

    updateEquipmentValue(key: string, value: number) {
        const control = this.bookingForm.controls.equipment_needed;

        control.setValue({
            ...control.value,
            [key]: Math.min(
                Math.max(this.getEquipmentLimit(key) + value, 0),
                this.equipment_available[
                    key as keyof typeof this.equipment_available
                ].limit
            ),
        });
    }

    public async onFormSubmit(): Promise<void> {
        const formResponse = this.validatorService.validateForm<
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
