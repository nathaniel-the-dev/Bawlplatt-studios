import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { BookingsPage } from './bookings/bookings.page';
import { ProfilePage } from './profile/profile.page';
import { HistoryPage } from './history/history.page';

import { SidenavComponent } from '../layout/sidenav/sidenav.component';



@NgModule({
    declarations: [
        SidenavComponent,
        DashboardPage,
        BookingsPage,
        ProfilePage,
        HistoryPage,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule
    ]
})
export class DashboardModule { }
