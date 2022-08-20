import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { APIResponse } from '../shared/api-response';
import { ErrorService } from '../shared/error.service';
import { environment } from 'src/environments/environment';
import { User } from '../shared/User';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private API_URL = environment.API_URL + '/users';

    private _authToken?: string;
    get authToken(): string | null {
        return this._authToken || localStorage.getItem('auth_token');
    }
    get isLoggedIn(): boolean {
        return !!this.authToken;
    }

    constructor(private errorService: ErrorService, private http: HttpClient) { }

    login(creds: any): Observable<APIResponse<string>> {
        return this.http.post<APIResponse>(this.API_URL + '/login', creds).pipe(
            tap(this.setAuthSession),
            catchError((err) => this.errorService.handleGenericError(err))
        );
    }

    logout(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.API_URL + '/logout').pipe(
            tap(this.clearAuthSession),
            catchError((err) => this.errorService.handleGenericError(err))
        );
    }

    private setAuthSession(res: APIResponse<string>): void {
        if (res.status !== 'success' || !res.data) return;

        // Set and save the JWT token
        this._authToken = res.data['token'];

        // Store JWT token to storage
        localStorage.setItem('auth_token', this._authToken)
    }

    private clearAuthSession(res: APIResponse) {
        if (res.status !== 'success') return;

        // Clear the JWT auth token
        this._authToken = undefined;

        // Clear JWT token from storage
        localStorage.removeItem('auth_token');
    }
}
