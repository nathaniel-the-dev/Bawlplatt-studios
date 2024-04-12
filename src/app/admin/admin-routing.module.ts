import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { BookingFormPage } from './dashboard/bookings/booking-form/booking-form.page';
import { BookingsPage } from './dashboard/bookings/bookings.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { HistoryPage } from './dashboard/history/history.page';
import { ProfilePage } from './dashboard/profile/profile.page';

const routes: Route[] = [
    { path: 'login', component: LoginPage },

    {
        path: '',
        component: DashboardPage,
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
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
