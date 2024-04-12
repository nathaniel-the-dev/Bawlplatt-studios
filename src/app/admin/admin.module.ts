import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard/dashboard.page';
import { LoginPage } from './auth/login/login.page';
import { BookingsPage } from './dashboard/bookings/bookings.page';
import { BookingFormPage } from './dashboard/bookings/booking-form/booking-form.page';
import { HistoryPage } from './dashboard/history/history.page';
import { ProfilePage } from './dashboard/profile/profile.page';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    declarations: [
        DashboardPage,
        BookingsPage,
        BookingFormPage,
        HistoryPage,
        ProfilePage,

        SidenavComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedComponentsModule,
        AdminRoutingModule,
    ],
})
export class AdminModule {}
