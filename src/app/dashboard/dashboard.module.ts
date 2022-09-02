import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { BookingsPage } from './bookings/bookings.page';
import { ProfilePage } from './profile/profile.page';
import { HistoryPage } from './history/history.page';

import { SidenavComponent } from '../layout/sidenav/sidenav.component';
import { BookingFormPage } from './bookings/booking-form/booking-form.page';
import { FormatDatePipe } from '../shared/pipes/format-date.pipe';
import { FormatContactNumPipe } from '../shared/pipes/format-contact-num.pipe';
import { SharedComponentsModule } from '../shared/modules/shared-components/shared-components.module';


@NgModule({
    declarations: [
        SidenavComponent,
        DashboardPage,
        BookingsPage,
        BookingFormPage,
        ProfilePage,
        HistoryPage,
        FormatDatePipe,
        FormatContactNumPipe,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedComponentsModule
    ]
})
export class DashboardModule { }
