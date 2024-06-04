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
import { PrivacyPolicyPage } from './pages/privacy-policy/privacy-policy.page';
import { TermsAndCondPage } from './pages/terms-and-cond/terms-and-cond.page';
import { SITE_NAME } from './shared/config/constants';
import { CheckoutPage } from './pages/checkout/checkout.page';
import { RedirectOnlyGuard } from './admin/shared/guards/redirect-only.guard';
import { FaqPage } from './pages/faq/faq.page';
import { CustomerProfilePage } from './pages/customer-dashboard/profile/profile.page';
import { ForgotPasswordPage } from './pages/auth/forgot-password/forgot-password.page';

const routes: Routes = [
    { path: 'home', component: HomePage },
    { path: 'about', component: AboutPage, title: SITE_NAME + ' | About Us' },
    { path: 'faq', component: FaqPage, title: SITE_NAME + ' | FAQ' },
    {
        path: 'contact',
        component: ContactPage,
        title: SITE_NAME + ' | Contact Us',
    },

    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'forgot-password', component: ForgotPasswordPage },

    {
        path: 'booking/new/checkout',
        component: CheckoutPage,
        canActivate: [
            RedirectOnlyGuard,
            AuthRequiredGuard('/login'),
            HasPermissionGuard('customer'),
        ],
    },
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
            {
                path: 'bookings',
                component: CustomerBookingsPage,
                title: SITE_NAME + ' | My Bookings',
            },
            {
                path: 'profile',
                component: CustomerProfilePage,
                title: SITE_NAME + ' | My Profile',
            },
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

    {
        path: 'privacy-policy',
        component: PrivacyPolicyPage,
        title: SITE_NAME + ' | Privacy Policy',
    },
    {
        path: 'terms-and-conditions',
        component: TermsAndCondPage,
        title: SITE_NAME + ' | Terms and Conditions',
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
