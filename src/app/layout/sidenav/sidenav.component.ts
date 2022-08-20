import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit(): void {
    }

    logout(): void {
        this.userService.logout().subscribe((res) => {
            if (res.status === 'success') this.router.navigateByUrl('/login');
        })
    }
}
