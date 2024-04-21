import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    async canAccess(apiService: ApiService, router: Router) {
        const user = await apiService.getCurrentUser();
        return Boolean(user) || router.parseUrl('/admin/login');
    }

    constructor() {}
}
