import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { APIResponse } from './api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(private router: Router) { }

    handleGenericError(err: HttpErrorResponse): Observable<any> {
        let error: APIResponse = { status: err.error['status'] || 'error', message: err.error['message'] || 'Something went wrong' }

        // 402 - Unauthorized
        if (err.status === 401) this.router.navigateByUrl('/login');

        console.error(error);
        return of(error);
    }

}
