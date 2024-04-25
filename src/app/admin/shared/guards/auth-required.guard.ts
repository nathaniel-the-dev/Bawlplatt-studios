import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';

export function AuthRequiredGuard(): Promise<boolean | UrlTree> {
    return inject(PermissionsService).canLoad(
        inject(ApiService),
        inject(Router)
    );
}
