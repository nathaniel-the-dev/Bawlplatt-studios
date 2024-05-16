import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import errors from '../config/errors';

@Injectable({
    providedIn: 'root',
})
export class ValidatorService implements OnDestroy {
    public errors$ = new Subject<Record<string, string>>();
    private _errors: Record<string, string> = {};
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
        for (let name in form.controls) {
            // Get associated control
            const control = form.get(name);
            if (!control) continue;

            this.subscriptions.add(
                control.valueChanges.subscribe(() => {
                    this.validateControl(control, name, ref);
                })
            );
        }

        this.subscriptions.add(
            this.errors$.subscribe((errors) => {
                cb(errors);
            })
        );
    }

    public validateControl(
        control: AbstractControl,
        name: string,
        formRef?: FormGroupDirective
    ) {
        if (!formRef || formRef.submitted) {
            if (control?.invalid && control?.dirty) {
                // Only get the first error for each control
                const [key, value] = Object.entries(control!.errors!)[0];
                this._errors = {
                    ...this._errors,
                    [name]: this.formatErrorMessage(name, key, value),
                };
                this.errors$.next(this._errors);
            }

            if (control.valid) {
                this._errors = {
                    ...this._errors,
                    [name]: '',
                };
                this.errors$.next(this._errors);
            }
        }
    }

    public validateForm<TForm extends FormGroup = FormGroup>(
        form: TForm,
        ref?: FormGroupDirective
    ) {
        let errors: Record<keyof TForm['controls'], string> = {} as Record<
            keyof TForm['controls'],
            string
        >;

        form.markAsDirty();

        for (let name in form.controls) {
            // Get associated control
            const control = form.get(name);

            // Reset errors for each control
            (errors as any)[name] = '';

            if (!ref || ref.submitted)
                if (control?.invalid) {
                    // Validate each input control
                    const [key, value] = Object.entries(control!.errors!)[0];
                    (errors as any)[name] = this.formatErrorMessage(
                        name,
                        key,
                        value
                    );
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

        if (
            errors.validations.hasOwnProperty(field) &&
            errors.validations[field].hasOwnProperty(key)
        ) {
            return errors.validations[field][key];
        }

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
