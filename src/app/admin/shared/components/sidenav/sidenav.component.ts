import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/admin/shared/models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit, OnDestroy {
    user?: User;

    private userSubscription?: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {
        const sub = this.userService.updatedUser$.subscribe((user) => {
            this.user = user;
        });
        this.userSubscription?.add(sub);
    }

    ngOnInit(): void {
        if (!this.userService.currentUser)
            this.userSubscription = this.userService
                .getCurrentUser()
                .subscribe((res) => {
                    if (res.status === 'success') this.user = res.data!['user'];
                });
        else this.user = this.userService.currentUser;
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    logout(): void {
        this.authService.logout().subscribe((res) => {
            if (res.status === 'success') this.router.navigateByUrl('/login');
        });
    }
}
