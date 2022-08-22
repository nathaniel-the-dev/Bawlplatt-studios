import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, Token } from '../shared/models/api-response';
import { ErrorService } from '../shared/services/error.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private API_URL = environment.API_URL + '/users';

    private _authToken?: string;
    get authToken(): string | undefined {
        return this._authToken;
    }
    get isLoggedIn(): boolean {
        return !!this._authToken;
    }

    constructor(private errorService: ErrorService, private http: HttpClient) {
        this.autoLogin();
    }

    login(creds: { email: string, password: string }): Observable<APIResponse<string>> {
        return this.http.post<APIResponse>(this.API_URL + '/login', creds).pipe(
            tap((res) => this.setAuthSession(res)),
            catchError((err) => this.errorService.handleHTTPError(err)),
        );
    }

    logout(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.API_URL + '/logout').pipe(
            tap((res) => (res.status === 'success') && this.clearAuthSession()),
            catchError((err) => this.errorService.handleHTTPError(err)),
        );
    }

    private _getAuthTokenFromStorage(): Token | null {
        let token: string | null = localStorage.getItem('auth_token');

        return token ? JSON.parse(token, (key, val) => (key === 'expires') ? new Date(val) : val) as Token : null;
    }

    private _setToken(token: Token) {
        this._authToken = token.value;
    }

    private autoLogin(): void {
        const token = this._getAuthTokenFromStorage();

        // Check if token is present and has not expired
        if (!token || Date.now() > token.expires.getTime()) return this.clearAuthSession();

        // Set token and start session timer
        this._setToken(token);
    }

    private setAuthSession(res: APIResponse<Token>): void {
        if (res.status !== 'success' || !res.data) return;

        // Set and save the JWT token
        const token = res.data['token'];
        this._setToken(token);

        // Store JWT token in local storage
        localStorage.setItem('auth_token', JSON.stringify(token));
    }

    private clearAuthSession() {
        // Clear the JWT auth token
        this._authToken = undefined;

        // Clear JWT token from storage
        localStorage.removeItem('auth_token');
    }
}
