import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';

export function AuthRequiredGuard(redirectUrl: string) {
    return async (): Promise<boolean | UrlTree> => {
        const permissionService = inject(PermissionsService);
        const apiService = inject(ApiService);
        const router = inject(Router);

        const canLoad = await permissionService.canLoad(apiService);
        const isVerified = await permissionService.isVerified(apiService);

        return (canLoad && isVerified) || router.parseUrl(redirectUrl);
    };
}
