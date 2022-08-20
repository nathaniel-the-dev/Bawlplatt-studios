import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { BookingFormPage } from '../bookings/booking-form/booking-form.page';
import { BookingsPage } from './bookings/bookings.page';
import { HistoryPage } from './history/history.page';
import { ProfilePage } from './profile/profile.page';

const routes: Routes = [
    {
        path: '',
        component: DashboardPage,
        children: [
            {
                path: 'bookings',
                children: [
                    { path: 'new', component: BookingFormPage, data: { redirectTo: '/dashboard/bookings' } },
                    { path: 'edit/:id', component: BookingFormPage, data: { redirectTo: '/dashboard/bookings' } },
                    { path: '', component: BookingsPage },
                ]
            },
            { path: 'profile', component: ProfilePage },
            { path: 'history', component: HistoryPage },
            { path: '', redirectTo: 'bookings', pathMatch: 'full' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
