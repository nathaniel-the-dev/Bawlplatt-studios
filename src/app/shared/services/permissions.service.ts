import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    // Add guard to check if user is verified
    async isVerified(apiService: ApiService) {
        return apiService.user?.user_metadata['profile']?.verified_at
            ? true
            : false;
    }

    async canLoad(apiService: ApiService) {
        // Check is user is logged in
        const user = apiService.user || (await apiService.getCurrentUser());

        // If not, redirect to login
        if (!user) {
            await apiService.logout();
            return false;
        }
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

        const isAllowed =
            user?.user_metadata['profile']?.role &&
            allowedRoles.some(
                (role: string) =>
                    role === user.user_metadata['profile']?.role.title
            );
        return isAllowed || router.parseUrl('/404');
    }

    constructor() {}
}
