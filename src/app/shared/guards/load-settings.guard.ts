import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

export const LoadSettingsGuard: CanActivateFn = async () => {
    const apiService = inject(ApiService);
    const router = inject(Router);
    try {
        await apiService.getSettings();
        return true;
    } catch (error) {
        router.navigate(['/error']);
        return false;
    }
};
