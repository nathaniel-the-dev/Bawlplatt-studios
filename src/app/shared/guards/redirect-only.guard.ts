import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

export function HasPermissionGuard(): boolean | UrlTree {
    const currentNavigation = inject(Router).getCurrentNavigation();
    console.log(currentNavigation);

    return false;
}
