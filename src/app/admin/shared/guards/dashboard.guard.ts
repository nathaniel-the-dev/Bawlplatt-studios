import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';

export function DashboardGuard(): Promise<boolean | UrlTree> {
    return inject(PermissionsService).canAccess(
        inject(ApiService),
        inject(Router)
    );
}
