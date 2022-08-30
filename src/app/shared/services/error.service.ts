import { FormGroup, ValidationErrors } from '@angular/forms';
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
                type: res.error?.error.type || 'RequestError',
                message: res.error?.error.message || 'Something went wrong',
                errors: res.error?.error.type === 'ValidationError' ? res.error.error.errors : undefined
            }
        }

        if (res instanceof HttpErrorResponse) {
            // 401 - Unauthorized
            if (res.status === 401) this.router.navigateByUrl('/login');
        }

        console.error(res);
        return of(response);
    }

    public handleValidationError(err: APIResponse, form: FormGroup): void {
        let error = err.error?.errors!;
        let keys = Object.keys(error);

        keys.forEach(key => {
            const control = form.get(key);
            if (control) control.setErrors({ async: error[key] });
        });
    }

}
