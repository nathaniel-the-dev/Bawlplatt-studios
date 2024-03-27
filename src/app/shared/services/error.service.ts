import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { APIResponse } from './../models/api-response';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(private toastService: ToastService, private router: Router) { }

    public handleHTTPError(res: HttpErrorResponse | any): Observable<any> {
        let response: APIResponse = {
            status: res.error?.status || 'error',
            error: {
                type: res.error?.error?.type || 'RequestError',
                message: res.error?.error?.message || 'Something went wrong',
                errors: res.error?.error?.type === 'ValidationError' ? res.error.error.errors : undefined
            }
        }

        if (res instanceof HttpErrorResponse) {
            // 0 - Unkown error
            if (res.status === 0)
                this.toastService.createToast('A Error Occured', 'Something went wrong. Please try again later.', 'error');

            // 401 - Unauthorized
            if (res.status === 401) this.router.navigateByUrl('/login');
        } else {
            this.toastService.createToast('A Error Occured', 'Something went wrong. Please try again later.', 'error');
        }

        return of(response);
    }

    public handleValidationError(err: APIResponse, form: UntypedFormGroup): void {
        let error = err.error?.errors!;
        let keys = Object.keys(error);

        keys.forEach(key => {
            const control = form.get(key);
            if (control) control.setErrors({ async: error[key] });
        });
    }

}
