import { Injectable } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
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

    public validateOnInput(
        form: FormGroup,
        cb: (errors: any) => void,
        ref?: FormGroupDirective
    ) {
        this.subscriptions.add(
            form.valueChanges.subscribe(() => {
                const errors = this.validate<typeof form>(form, ref).errors;
                this.errors$.next(errors);
                cb(errors);
            })
        );
    }

    public validate<TForm extends FormGroup = FormGroup>(
        form: TForm,
        ref?: FormGroupDirective
    ) {
        let errors: Record<keyof TForm['controls'], string> = {} as Record<
            keyof TForm['controls'],
            string
        >;

        for (let name in form.controls) {
            // Get associated control
            const control = form.get(name);

            // Reset errors for each control
            (errors as any)[name] = '';

            if (!ref || ref.submitted)
                if (control?.invalid) {
                    // Validate each input control
                    const [key, value] = Object.entries(control!.errors!)[0];
                    (errors as any)[name] = (() => {
                        let errorMessage = this.formatErrorMessage(
                            name,
                            key,
                            value
                        );
                        return errorMessage;
                    })();
                }
        }

        // Set errors and return validation result
        this.errors$.next(errors);
        return {
            errors: errors,
            valid: form.valid,
        };
    }

    private formatErrorMessage(field: string, key: string, value: any) {
        if (!value) return '';

        let fieldName = field;

        // Separate field names with spaces
        fieldName = fieldName.replace(/([A-Z])/g, ' $1').trim();
        // Remove underscores or hyphens
        fieldName = fieldName.replace(/[_-]/g, ' ');
        // Capitalize first letter
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        switch (key) {
            case 'required':
                return `${fieldName} is required`;
            case 'email':
                return `${fieldName} is not a valid email address`;
            case 'minlength':
                return `${fieldName} must be at least ${value.requiredLength} characters`;
            case 'maxlength':
                return `${fieldName} must be at most ${value.requiredLength} characters`;
            case 'pattern':
            case 'async':
            case 'range':
            default:
                return typeof value === 'string'
                    ? value
                    : `${fieldName} is invalid`;
        }
    }
}
