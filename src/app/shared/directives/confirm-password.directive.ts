import { Directive, Input } from '@angular/core';
import {
    AbstractControl,
    NG_VALIDATORS,
    ValidationErrors,
    Validator,
} from '@angular/forms';

@Directive({
    selector: '[confirmPasswordValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: ConfirmPasswordValidatorDirective,
            multi: true,
        },
    ],
})
export class ConfirmPasswordValidatorDirective implements Validator {
    private defaultPasswordControlName = 'password';
    @Input('confirmPasswordValidator') passwordControlName: string =
        this.defaultPasswordControlName;

    validate(control: AbstractControl): ValidationErrors | null {
        const password: AbstractControl | null | undefined =
            control.parent?.get(
                this.passwordControlName || this.defaultPasswordControlName
            );

        if (!password || control.value === password.value) {
            return null;
        }

        return { confirm: 'Passwords do not match' };
    }
}
