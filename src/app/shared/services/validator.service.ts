import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ValidatorService {
    public errors$ = new Subject<any>();
    private subscriptions = new Subscription();

    constructor() {}

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public validateOnInput(form: FormGroup, cb: (errors: any) => void) {
        this.subscriptions.add(
            form.valueChanges.subscribe(() => {
                const errors = this.validate<typeof form>(form).errors;
                this.errors$.next(errors);
                cb(errors);
            })
        );
    }

    public validate<TForm extends FormGroup = FormGroup>(form: TForm) {
        let errors: Record<keyof TForm['controls'], string> = {} as Record<
            keyof TForm['controls'],
            string
        >;

        for (let name in form.controls) {
            // Get associated control
            const control = form.get(name);

            // Check if control is valid
            if (!control || control.valid) {
                (errors as any)[name] = '';
                continue;
            }

            // Validate each input control
            const [key, value] = Object.entries(control!.errors!)[0];

            (errors as any)[name] = (() => {
                let errorMessage = this.formatValidationError(name, key, value);
                return errorMessage;
            })();
        }

        // Set errors and return validation result
        this.errors$.next(errors);
        return {
            errors: errors,
            valid: form.valid,
        };
    }

    private formatValidationError(field: string, key: string, value: any) {
        if (!value) return '';

        let fieldName = field.replace(/([A-Z])/g, ' $1').trim();
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        switch (key) {
            case 'required':
                return `${fieldName} is required`;
            case 'email':
                return `${fieldName} is not a valid email address`;

            case 'async':
            case 'range':
            default:
                return typeof value === 'string'
                    ? value
                    : `${fieldName} is invalid`;
        }
    }
}
