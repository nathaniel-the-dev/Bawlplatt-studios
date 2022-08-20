import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './auth/login/login.page';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupPage } from './auth/signup/signup.page';
import { AuthInterceptor } from './shared/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomePage,
        LoginPage,
        NotFoundPage,
        AboutPage,
        ContactPage,
        SignupPage,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
