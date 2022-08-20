import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../auth/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.userService.authToken;

        if (authToken) {
            let clonedReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${authToken}`)
            });

            return next.handle(clonedReq);
        }

        return next.handle(request);
    }
}
