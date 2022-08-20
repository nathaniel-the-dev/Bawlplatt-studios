import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { APIResponse } from '../shared/api-response';
import { ErrorService } from '../shared/error.service';
import { environment } from 'src/environments/environment';
import { User } from '../shared/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private API_URL = environment.API_URL + '/users';

    constructor(private errorService: ErrorService, private http: HttpClient) { }

    getCurrentUser(): Observable<APIResponse<User>> {
        return this.http.get<APIResponse<User>>(this.API_URL + '/profile').pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    };

    updateCurrentUser(data: any): Observable<APIResponse<User>> {
        return this.http.patch<APIResponse<User>>(this.API_URL + '/profile', data).pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    deleteCurrentUser(): Observable<APIResponse<null>> {
        return this.http.delete<APIResponse<null>>(this.API_URL + '/profile').pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }
}
