import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, Subject } from 'rxjs';
import { APIResponse, Token } from '../models/api-response';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { ErrorService } from 'src/app/shared/services/error.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_URL = environment.API_URL + '/users';

    currentUser?: User;
    setUpdatedUser(user: User) {
        this.currentUser = user;
        this.updatedUser$.next(user);
    }
    updatedUser$ = new Subject<User>();

    constructor(
        private authService: AuthService,
        private errorService: ErrorService,
        private http: HttpClient
    ) {}

    getCurrentUser(): Observable<APIResponse<User>> {
        return this.http.get<APIResponse<User>>(this.API_URL + '/profile').pipe(
            tap((res) => {
                if (res.status === 'success')
                    this.currentUser = res.data!['user'];
            }),
            catchError((err) => this.errorService.handleHTTPError(err))
        );
    }

    verifyUser(payload: { password: string }): Observable<APIResponse> {
        return this.http
            .post<APIResponse>(this.API_URL.concat('/profile/verify'), payload)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    updateCurrentUser(data: any): Observable<APIResponse<User>> {
        return this.http
            .patch<APIResponse<User>>(this.API_URL + '/profile', data)
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }

    updateCurrentUserPassword(data: any): Observable<APIResponse<Token>> {
        return this.http
            .patch<APIResponse<Token>>(this.API_URL + '/profile/password', data)
            .pipe(
                tap((res) => this.authService.setAuthSession(res)),
                catchError((err) => this.errorService.handleHTTPError(err))
            );
    }

    deleteCurrentUser(): Observable<APIResponse<null>> {
        return this.http
            .delete<APIResponse<null>>(this.API_URL + '/profile')
            .pipe(catchError((err) => this.errorService.handleHTTPError(err)));
    }
}