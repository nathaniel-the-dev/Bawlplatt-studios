import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit, OnDestroy {
    user: any;
    profileImage = '';

    public menuItems = [
        {
            name: 'Dashboard',
            path: 'dashboard',
            icon: 'ai-home-alt1',
            roles: ['admin', 'staff'],
        },
        {
            name: 'Bookings',
            path: 'bookings',
            icon: 'ai-book-open',
            roles: ['admin', 'staff'],
        },
        {
            name: 'Calendar',
            path: 'calendar',
            icon: 'ai-calendar',
            roles: ['admin', 'staff'],
        },
        {
            name: 'History',
            path: 'history',
            icon: 'ai-clock',
            roles: ['admin', 'staff'],
        },
        {
            name: 'Users',
            path: 'users',
            icon: 'ai-people-group',
            roles: ['admin'],
        },
        {
            name: 'Transactions',
            path: 'transactions',
            icon: 'ai-money',
            roles: ['admin', 'staff'],
        },
        {
            name: 'Reports',
            path: 'reports',
            icon: 'ai-file',
            roles: ['admin', 'staff'],
        },
        {
            name: 'Audit Log',
            path: 'audit-log',
            icon: 'ai-flag',
            roles: ['admin'],
        },
    ];

    private subscriptions = new Subscription();

    constructor(private apiService: ApiService, private router: Router) {}
    ngOnInit(): void {
        this.subscriptions.add(
            this.apiService.user$.subscribe((user) => {
                this.user = user;

                this.profileImage =
                    user?.user_metadata['avatar'] ||
                    `https://api.dicebear.com/8.x/initials/svg?seed=${user?.user_metadata['name']}&backgroundColor=000000`;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    async logout() {
        await this.apiService.logout();

        this.router.navigateByUrl('/admin/login');
    }
}
