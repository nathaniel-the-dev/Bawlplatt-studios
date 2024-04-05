import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { RequiresAuthGuard } from './shared/guards/requires-auth.guard';
import { RequiresUnauthGuard } from './shared/guards/requires-unauth.guard';

const routes: Route[] = [
    { path: 'login', component: LoginPage, canActivate: [RequiresUnauthGuard] },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
        canActivate: [RequiresAuthGuard],
        canLoad: [RequiresAuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
