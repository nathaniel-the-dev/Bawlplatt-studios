import { catchError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Booking } from 'src/app/admin/shared/models/booking';
import {
    APIResponse,
    QueryOptions,
} from 'src/app/admin/shared/models/api-response';
import { ErrorService } from 'src/app/shared/services/error.service';

@Injectable({
    providedIn: 'root',
})
export class BookingsService {
    private API_URL = environment.API_URL + '/bookings';

    constructor(private http: HttpClient, private errorService: ErrorService) {}

    private _createQueryString(opts: QueryOptions): string {
        const urlQueryString = new URLSearchParams('');

        for (const key in opts) {
            if (opts.hasOwnProperty(key)) {
                if (!opts[key]) continue;

                if (typeof opts[key] === 'object') {
                    urlQueryString.append(
                        key,
                        opts[key]!.key + '=' + opts[key]!.value
                    );
                    continue;
                }

                urlQueryString.append(key, opts[key]);
            }
        }

        return urlQueryString.toString();
    }

    getAllBookings(opts?: QueryOptions): Observable<APIResponse<Booking[]>> {
        let queryString = opts ? `?${this._createQueryString(opts)}` : '';

        return this.http
            .get<APIResponse<Booking[]>>(this.API_URL + queryString)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    getBookingById(id: string): Observable<APIResponse<Booking>> {
        return this.http
            .get<APIResponse<Booking>>(this.API_URL + '/' + id)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    createBooking(data: Booking): Observable<APIResponse<Booking>> {
        return this.http
            .post<APIResponse<Booking>>(this.API_URL, data)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    updateBooking(data: Booking): Observable<APIResponse<Booking>> {
        return this.http
            .patch<APIResponse<Booking>>(this.API_URL + '/' + data._id, data)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    approveBooking(
        id: string,
        data: { completed?: boolean; payed?: boolean }
    ): Observable<APIResponse<Booking>> {
        return this.http
            .patch<APIResponse<Booking>>(this.API_URL + '/approve/' + id, data)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    deleteBooking(id: string): Observable<APIResponse<null>> {
        return this.http
            .delete<APIResponse<null>>(this.API_URL + '/' + id)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }
}