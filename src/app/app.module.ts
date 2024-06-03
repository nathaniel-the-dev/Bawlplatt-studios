import { SharedComponentsModule } from './shared/shared-components.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home/home.page';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { MakeBookingPage } from './pages/make-booking/make-booking.page';
import { AdminModule } from './admin/admin.module';
import { ApiService } from './shared/services/api.service';
import { ToastService } from './shared/services/toast.service';
import { ValidatorService } from './shared/services/validator.service';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { CustomerDashboardPage } from './pages/customer-dashboard/customer-dashboard.page';
import { CustomerBookingsPage } from './pages/customer-dashboard/bookings/bookings.page';
import { PrivacyPolicyPage } from './pages/privacy-policy/privacy-policy.page';
import { TermsAndCondPage } from './pages/terms-and-cond/terms-and-cond.page';
import { CheckoutPage } from './pages/checkout/checkout.page';
import { FaqPage } from './pages/faq/faq.page';

@NgModule({
    declarations: [
        AppComponent,

        HomePage,
        NotFoundPage,
        AboutPage,
        ContactPage,
        MakeBookingPage,
        LoginPage,
        RegisterPage,
        CustomerDashboardPage,
        CustomerBookingsPage,
        PrivacyPolicyPage,
        TermsAndCondPage,
        CheckoutPage,
        FaqPage,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,

        AdminModule,
        SharedComponentsModule,
    ],
    providers: [ApiService, ToastService, ValidatorService],
    bootstrap: [AppComponent],
})
export class AppModule {}
