import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { BookingsPage } from './bookings/bookings.page';
import { ProfilePage } from './profile/profile.page';
import { HistoryPage } from './history/history.page';

import { SidenavComponent } from '../layout/sidenav/sidenav.component';
import { BookingFormPage } from './bookings/booking-form/booking-form.page';


@NgModule({
    declarations: [
        SidenavComponent,
        DashboardPage,
        BookingsPage,
        BookingFormPage,
        ProfilePage,
        HistoryPage,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule
    ]
})
export class DashboardModule { }
