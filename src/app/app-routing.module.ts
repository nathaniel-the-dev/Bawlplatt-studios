import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { HomePage } from './pages/home/home.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { MakeBookingPage } from './pages/make-booking/make-booking.page';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { CustomerDashboardPage } from './pages/customer-dashboard/customer-dashboard.page';
import { CustomerBookingsPage } from './pages/customer-dashboard/bookings/bookings.page';
import { AuthRequiredGuard } from './shared/guards/auth-required.guard';
import { HasPermissionGuard } from './shared/guards/has-permission.guard';

const routes: Routes = [
    { path: 'home', component: HomePage },
    { path: 'about', component: AboutPage },
    { path: 'contact', component: ContactPage },

    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },

    {
        path: 'booking/new',
        component: MakeBookingPage,
        canActivate: [
            AuthRequiredGuard('/login'),
            HasPermissionGuard('customer'),
        ],
    },
    {
        path: 'dashboard',
        component: CustomerDashboardPage,
        children: [
            { path: 'bookings', component: CustomerBookingsPage },
            { path: '', redirectTo: 'bookings', pathMatch: 'full' },
        ],
        canActivate: [
            AuthRequiredGuard('/login'),
            HasPermissionGuard('customer'),
        ],
    },

    {
        path: 'admin',
        loadChildren: () =>
            import('./admin/admin.module').then((m) => m.AdminModule),
    },

    { path: 'not-allowed', component: NotFoundPage },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: NotFoundPage },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'top',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
