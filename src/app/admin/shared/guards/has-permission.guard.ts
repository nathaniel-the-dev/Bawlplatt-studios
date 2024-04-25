import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';

export function HasPermissionGuard(...roles: string[]) {
    return (): Promise<boolean | UrlTree> => {
        return inject(PermissionsService).hasPermission(
            roles,
            inject(ApiService),
            inject(Router)
        );
    };
}
