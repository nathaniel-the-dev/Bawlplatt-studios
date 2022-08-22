import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { APIResponse } from '../shared/models/api-response';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user';
import { ErrorService } from '../shared/services/error.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private API_URL = environment.API_URL + '/users';

    constructor(private errorService: ErrorService, private http: HttpClient) { }

    getCurrentUser(): Observable<APIResponse<User>> {
        return this.http.get<APIResponse<User>>(this.API_URL + '/profile').pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    };

    verifyUser(payload: { password: string }): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.API_URL.concat('/profile/verify'), payload).pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    updateCurrentUser(data: any): Observable<APIResponse<User>> {
        return this.http.patch<APIResponse<User>>(this.API_URL + '/profile', data).pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    updateCurrentUserPassword(data: any): Observable<APIResponse<User>> {
        return this.http.patch<APIResponse<User>>(this.API_URL + '/profile/password', data).pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    deleteCurrentUser(): Observable<APIResponse<null>> {
        return this.http.delete<APIResponse<null>>(this.API_URL + '/profile').pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }
}
