import { catchError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Booking } from 'src/app/shared/models/booking';
import { APIResponse } from 'src/app/shared/models/api-response';
import { ErrorService } from 'src/app/shared/services/error.service';

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

    getBookingById(id: string): Observable<APIResponse<Booking>> {
        return this.http.get<APIResponse<Booking>>(this.API_URL + "/" + id).pipe(
            catchError((err) => this.errorService.handleHTTPError(err))
        );
    }

    createBooking(data: Booking): Observable<APIResponse<Booking>> {
        return this.http.post<APIResponse<Booking>>(this.API_URL, data).pipe(
            catchError((err) => this.errorService.handleHTTPError(err))
        );
    }

    updateBooking(data: Booking): Observable<APIResponse<Booking>> {
        return this.http.patch<APIResponse<Booking>>(this.API_URL + "/" + data._id, data).pipe(
            catchError((err) => this.errorService.handleHTTPError(err))
        );
    }

    deleteBooking(id: string): Observable<APIResponse<null>> {
        return this.http.delete<APIResponse<null>>(this.API_URL + "/" + id).pipe(
            catchError((err) => this.errorService.handleHTTPError(err))
        )
    }
}
