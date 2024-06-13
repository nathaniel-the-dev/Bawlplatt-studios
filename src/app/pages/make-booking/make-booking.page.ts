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
    currentStep: 1 | 2 | 3 | 4 | 5 = 1;

    bookingForm = this.fb.group({
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
                [Validators.required, ValidateTime('08:00', '20:00')],
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

    errors = {
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
        return tempo.format(tempo.addDay(tempo.date(), 1), 'YYYY-MM-DD');
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
        this.getCustomerTypes();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private setDefaultFormValues() {
        let userID = this.apiService.user?.user_metadata['profile']?.id;
        this.customerForm.controls.booked_for.setValue(userID);
    }

    get listRequirements() {
        return Object.entries(
            this.requirementsForm.value.additional_requirements!
        )
            .filter(([_, value]) => +value > 0)
            .map(([e, value]) => `${value} ${e}`)
            .join(', ');
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
    }

    back() {
        this.currentStep = Math.max(1, this.currentStep - 1) as 1 | 2 | 3;
    }

    toCheckout() {
        this.router.navigateByUrl('/booking/new/checkout');
    }

    private async getCustomerTypes() {
        const { data } = await this.apiService.supabase
            .from('customer_type')
            .select('*');
        if (!data?.length) return;

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

    getEquipmentLimit(key: string): number {
        let label = key as keyof typeof this.equipment_available;
        return (
            this.requirementsForm.controls.equipment_needed.value?.[label] || 0
        );
    }

    updateEquipmentValue(key: string, value: number) {
        const control = this.requirementsForm.controls.equipment_needed;

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

    async onBookingFormSubmit(): Promise<void> {
        // TODO: Show confirmation page and proceed to payment
        try {
            let booking = {
                ...this.customerForm.value,
                ...this.sessionForm.value,
                ...this.requirementsForm.value,
            };
        } catch (error) {
            console.error(error);
        }
    }
}
