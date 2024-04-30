import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

export function RedirectOnlyGuard(): boolean | UrlTree {
    const router = inject(Router);
    let trigger = router.getCurrentNavigation()?.trigger;

    return trigger === 'imperative' || router.parseUrl('/');
}
