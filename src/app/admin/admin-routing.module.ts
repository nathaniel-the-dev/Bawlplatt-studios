import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { BookingFormPage } from './pages/bookings/booking-form/booking-form.page';
import { BookingsPage } from './pages/bookings/bookings.page';
import { DashboardLayoutPage } from './pages/layout.page';
import { HistoryPage } from './pages/history/history.page';
import { ProfilePage } from './pages/profile/profile.page';
import { AuthRequiredGuard } from './shared/guards/auth-required.guard';
import { CalendarPage } from './pages/calendar/calendar.page';
import { HasPermissionGuard } from './shared/guards/has-permission.guard';
import { UserListPage } from './pages/users/user-list/user-list.page';
import { TransactionsPage } from './pages/transactions/transactions.page';
import { ReportsPage } from './pages/reports/reports.page';
import { AuditPage } from './pages/audit/audit.page';
import { ForgotPasswordPage } from './auth/forgot-password/forgot-password.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';

const routes: Route[] = [
    { path: 'login', component: LoginPage },
    { path: 'forgot-password', component: ForgotPasswordPage },
    { path: 'reset-password', component: ForgotPasswordPage },

    {
        path: '',
        component: DashboardLayoutPage,
        children: [
            { path: 'dashboard', component: DashboardPage },
            {
                path: 'bookings',
                children: [
                    {
                        path: 'new',
                        component: BookingFormPage,
                    },
                    { path: 'edit/:id', component: BookingFormPage },
                    { path: '', component: BookingsPage },
                ],
            },
            {
                path: 'calendar',
                component: CalendarPage,
            },
            {
                path: 'history',
                component: HistoryPage,
                canActivate: [HasPermissionGuard('staff')],
            },
            {
                path: 'users',
                children: [
                    {
                        path: '',
                        component: UserListPage,
                    },
                ],
                canActivate: [HasPermissionGuard('admin')],
            },
            {
                path: 'transactions',
                component: TransactionsPage,
            },
            {
                path: 'reports',
                component: ReportsPage,
                canActivate: [HasPermissionGuard('admin')],
            },
            {
                path: 'audit_log',
                component: AuditPage,
                canActivate: [HasPermissionGuard('admin')],
            },
            {
                path: 'profile',
                component: ProfilePage,
            },

            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
        canActivate: [AuthRequiredGuard, HasPermissionGuard('admin', 'staff')],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
