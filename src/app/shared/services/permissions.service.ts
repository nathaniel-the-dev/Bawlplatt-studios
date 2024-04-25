import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    async canLoad(apiService: ApiService, router: Router) {
        // Check is user is logged in
        const user = apiService.user || (await apiService.getCurrentUser());

        // If not, redirect to login
        if (!user) return router.parseUrl('/admin/login');
        return true;
    }

    async hasPermission(
        allowedRoles: string[],
        apiService: ApiService,
        router: Router
    ) {
        // Check if user has access to that page
        if (!allowedRoles?.length) return true;

        const user = apiService.user || (await apiService.getCurrentUser(true));

        return (
            (user?.user_metadata['roles'] &&
                allowedRoles.some(
                    (role: string) => role === user.user_metadata['roles'].title
                )) ||
            router.parseUrl('/404')
        );
    }

    constructor() {}
}
