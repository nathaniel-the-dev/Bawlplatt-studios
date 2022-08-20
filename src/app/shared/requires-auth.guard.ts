import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../auth/user.service';

@Injectable({
    providedIn: 'root'
})
export class RequiresAuthGuard implements CanActivate, CanLoad {
    constructor(private userService: UserService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.userService.isLoggedIn) return this.router.parseUrl('/login');
        return true;
    }
    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.userService.isLoggedIn) return this.router.parseUrl('/login');
        return true;
    }
}
