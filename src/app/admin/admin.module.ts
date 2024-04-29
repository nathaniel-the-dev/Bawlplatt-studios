import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardLayoutPage } from './pages/layout.page';
import { BookingsPage } from './pages/bookings/bookings.page';
import { BookingFormPage } from './pages/bookings/booking-form/booking-form.page';
import { HistoryPage } from './pages/history/history.page';
import { ProfilePage } from './pages/profile/profile.page';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginPage } from './auth/login/login.page';
import { BookingDetailsPage } from './pages/bookings/booking-details/booking-details.page';
import { UserListPage } from './pages/users/user-list/user-list.page';
import { UserFormPage } from './pages/users/user-form/user-form.page';
import { CalendarPage } from './pages/calendar/calendar.page';
import { ReportsPage } from './pages/reports/reports.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { TransactionsPage } from './pages/transactions/transactions.page';
import { AuditPage } from './pages/audit/audit.page';
import { ForgotPasswordPage } from './auth/forgot-password/forgot-password.page';
import { MainLayout } from './layouts/main/main.layout';

@NgModule({
    declarations: [
        LoginPage,

        DashboardLayoutPage,
        BookingsPage,
        BookingFormPage,
        HistoryPage,
        ProfilePage,

        SidenavComponent,
        BookingDetailsPage,
        UserListPage,
        UserFormPage,
        CalendarPage,
        ReportsPage,
        DashboardPage,
        TransactionsPage,
        AuditPage,
        ForgotPasswordPage,
        MainLayout,
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
