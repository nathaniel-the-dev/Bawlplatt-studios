import { RequiresAuthGuard } from './shared/requires-auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { LoginPage } from './auth/login/login.page';
import { HomePage } from './pages/home/home.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { BookingFormPage } from './bookings/booking-form/booking-form.page';

const routes: Routes = [
    { path: 'home', component: HomePage },
    { path: 'about', component: AboutPage },
    { path: 'contact', component: ContactPage },

    { path: 'login', component: LoginPage },

    { path: 'bookings/new', component: BookingFormPage },

    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canLoad: [RequiresAuthGuard] },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: NotFoundPage }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
