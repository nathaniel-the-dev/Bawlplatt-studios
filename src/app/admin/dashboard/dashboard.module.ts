import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { BookingsPage } from './bookings/bookings.page';
import { ProfilePage } from './profile/profile.page';
import { HistoryPage } from './history/history.page';
import { BookingFormPage } from './bookings/booking-form/booking-form.page';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
import { AdminSharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        DashboardPage,
        BookingsPage,
        BookingFormPage,
        ProfilePage,
        HistoryPage,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        AdminSharedModule,
    ],
})
export class DashboardModule {}
