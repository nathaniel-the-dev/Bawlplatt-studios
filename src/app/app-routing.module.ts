import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { LoginPage } from './auth/login/login.page';
import { HomePage } from './pages/home/home.page';
import { AboutPage } from './pages/about/about.page';
import { ContactPage } from './pages/contact/contact.page';
import { MakeBookingPage } from './pages/make-booking/make-booking.page';
import { RequiresUnauthGuard } from './shared/guards/requires-unauth.guard';
import { RequiresAuthGuard } from './shared/guards/requires-auth.guard';

const routes: Routes = [
    { path: 'home', component: HomePage },
    { path: 'about', component: AboutPage },
    { path: 'contact', component: ContactPage },
    { path: 'booking/new', component: MakeBookingPage },

    { path: 'login', component: LoginPage, canActivate: [RequiresUnauthGuard] },

    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [RequiresAuthGuard],
        canLoad: [RequiresAuthGuard]
    },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: NotFoundPage }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
