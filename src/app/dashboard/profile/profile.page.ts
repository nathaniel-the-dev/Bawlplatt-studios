import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { User } from 'src/app/shared/user';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit {
    user?: User;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.getUserInformation();
    }

    getUserInformation(): void {
        this.userService.getCurrentUser().subscribe((res) => {
            if (res.status === 'success') this.user = res.data!['user'];
        });
    }
}
