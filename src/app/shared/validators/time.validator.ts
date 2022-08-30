import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function ValidateTime(start: string, end: string): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            const [hr] = control.value.split(':');

            const [start_hr] = start.split(':');
            const [end_hr] = end.split(':');


            if ((+hr < +start_hr) || (+hr > +end_hr)) {
                return { range: true }
            }
        }

        return null;
    }
}