import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ValidateTime } from 'src/app/shared/validators/time.validator';
import { animate, style, transition, trigger } from '@angular/animations';
import { ApiService } from 'src/app/shared/services/api.service';
import {
    AVAILABLE_EQUIPMENT,
    BOOKING_DURATIONS,
    MAX_MUSICIANS_COUNT,
} from 'src/app/shared/config/constants';
import * as tempo from '@formkit/tempo';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { Router } from '@angular/router';

type FormErrors<TForm extends FormGroup> = Record<
    keyof TForm['controls'],
    string
>;

type EquipmentNeeded = Partial<
    Record<
        keyof typeof MakeBookingPage.prototype.equipment_available,
        number | undefined
    >
>;

@Component({
    selector: 'app-make-booking',
    templateUrl: './make-booking.page.html',
    styleUrls: ['./make-booking.page.css'],
    animations: [
        trigger('changeSlide', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(2rem)' }),
                animate(
                    '300ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0rem)' })
                ),
            ]),
        ]),
    ],
})
export class MakeBookingPage implements OnInit, OnDestroy {
    public currentStep: 1 | 2 | 3 | 4 | 5 = 1;

    public bookingForm = this.fb.group({
        // Customer type
        customer: this.fb.group({
            customer_type: [null as string | null, [Validators.required]],
            booked_for: [null as string | null, [Validators.required]],
        }),

        // Session information
        session: this.fb.group({
            date_booked: [null as string | null, [Validators.required]],
            time_booked: [
                null as string | null,
                [
                    Validators.required,
                    ValidateTime(
                        this.apiService.settings['office_hours'].start,
                        this.apiService.settings['office_hours'].end
                    ),
                ],
            ],
            duration_in_minutes: [null as string | null, [Validators.required]],
        }),

        // Requirements
        requirements: this.fb.group({
            num_of_musicians: [
                null as string | null,
                [Validators.required, Validators.max(MAX_MUSICIANS_COUNT)],
            ],
            equipment_needed: [{} as EquipmentNeeded],
            additional_requirements: [null as string | null],
        }),
    });

    public errors = {
        customer: {} as FormErrors<typeof this.customerForm>,
        session: {} as FormErrors<typeof this.sessionForm>,
        requirements: {} as FormErrors<typeof this.requirementsForm>,
    };

    public customer_types: any[] = [];
    public durations = BOOKING_DURATIONS;
    public equipment_available = AVAILABLE_EQUIPMENT;

    private subscriptions = new Subscription();

    get customerForm() {
        return this.bookingForm.controls.customer;
    }
    get sessionForm() {
        return this.bookingForm.controls.session;
    }
    get requirementsForm() {
        return this.bookingForm.controls.requirements;
    }

    get minDate() {
        let today = tempo.date();
        return tempo.format(tempo.addDay(today, 1), 'YYYY-MM-DD');
    }
    get maxMusicians() {
        return MAX_MUSICIANS_COUNT;
    }
    get listEquipment() {
        return Object.entries(this.requirementsForm.value.equipment_needed!)
            .filter(([_, value]) => +value > 0)
            .map(([key, value]) => `${value} ${key}`)
            .join(', ');
    }

    constructor(
        private apiService: ApiService,
        private validator: ValidatorService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        // Set default values
        this.setDefaultFormValues();

        // Get customer types
        this.getFormSettings();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private setDefaultFormValues() {
        // Set booked_for to current user
        let userID = this.apiService.user?.user_metadata['profile']?.id;
        this.customerForm.controls.booked_for.setValue(userID);
    }

    next(formName: 'customer' | 'session' | 'requirements'): void {
        const form = this.bookingForm.get(formName) as FormGroup | null;

        if (!formName || !form) return;

        let formResponse = this.validator.validateForm<typeof form>(form);
        if (!formResponse.valid) {
            this.errors[formName] = formResponse.errors as any;
            console.log(this.errors);
            return;
        }

        this.currentStep = Math.min(5, this.currentStep + 1) as 1 | 2 | 3 | 4;
        this.clearErrors();
    }

    back() {
        this.currentStep = Math.max(1, this.currentStep - 1) as 1 | 2 | 3;
    }

    private async getFormSettings() {
        // Get customer types
        const { data } = await this.apiService.supabase
            .from('customer_type')
            .select('*');
        if (data?.length) {
            data.forEach(async (type: any) => {
                const {
                    data: { publicUrl },
                } = this.apiService.supabase.storage
                    .from('customer_types')
                    .getPublicUrl(type.image);

                type.image = publicUrl;
            });

            this.customer_types = data;
        }
    }

    getEquipmentLimit(key: string): number {
        let label = key as keyof typeof this.equipment_available;
        return (
            this.requirementsForm.controls.equipment_needed.value?.[label] || 0
        );
    }

    updateEquipmentValue(key: string, value: number) {
        const control = this.requirementsForm.controls.equipment_needed;

        control.patchValue({
            ...control.value,
            [key]: Math.min(
                Math.max(this.getEquipmentLimit(key) + value, 0),
                this.equipment_available[
                    key as keyof typeof this.equipment_available
                ].limit
            ),
        });
    }

    async onBookingFormSubmit(): Promise<void> {
        // Show confirmation page and proceed to checkout
        let booking = {
            ...this.customerForm.value,
            ...this.sessionForm.value,
            ...this.requirementsForm.value,
        };

        this.apiService.data$.next(booking);
        this.router.navigateByUrl('/booking/new/checkout');
    }

    clearErrors() {
        this.errors = {
            customer: {} as FormErrors<typeof this.customerForm>,
            session: {} as FormErrors<typeof this.sessionForm>,
            requirements: {} as FormErrors<typeof this.requirementsForm>,
        };

        this.bookingForm.markAsPristine();
        this.bookingForm.markAsUntouched();
    }

    getAvailableSlots() {
        // TODO: Get available slots
    }

    getNextAvailableSlot() {
        this.sessionForm.patchValue(
            {
                date_booked: this.minDate,
                time_booked: this.apiService.settings['office_hours'].start,
            },
            { emitEvent: false }
        );
    }

    getCustomerTypeName(id: number) {
        return this.customer_types.find((type) => type.id === id)?.name;
    }
}
