import { catchError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../shared/api-response';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../shared/error.service';
import { Booking } from 'src/app/shared/booking';

@Injectable({
    providedIn: 'root'
})
export class BookingsService {
    private API_URL = environment.API_URL + '/bookings';

    constructor(private http: HttpClient, private errorService: ErrorService) { }

    getAllBookings(): Observable<APIResponse<Booking[]>> {
        return this.http.get<APIResponse<Booking[]>>(this.API_URL).pipe(
            catchError((err) => this.errorService.handleHTTPError(err))
        );
    }

}
