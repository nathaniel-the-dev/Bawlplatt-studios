import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { BookingFormPage } from './pages/bookings/booking-form/booking-form.page';
import { BookingsPage } from './pages/bookings/bookings.page';
import { DashboardLayoutPage } from './pages/layout.page';
import { HistoryPage } from './pages/history/history.page';
import { ProfilePage } from './pages/profile/profile.page';
import { DashboardGuard } from './shared/guards/dashboard.guard';

const routes: Route[] = [
    { path: 'login', component: LoginPage },

    {
        path: '',
        component: DashboardLayoutPage,
        children: [
            {
                path: 'bookings',
                children: [
                    { path: 'new', component: BookingFormPage },
                    { path: 'edit/:id', component: BookingFormPage },
                    { path: '', component: BookingsPage },
                ],
            },
            { path: 'profile', component: ProfilePage },
            { path: 'history', component: HistoryPage },

            { path: '', redirectTo: 'bookings', pathMatch: 'full' },
        ],

        canActivate: [DashboardGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
