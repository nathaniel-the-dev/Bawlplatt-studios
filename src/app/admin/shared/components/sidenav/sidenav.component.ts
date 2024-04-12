import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { User } from '@supabase/supabase-js';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
    user: User | null;

    constructor(private apiService: ApiService, private router: Router) {
        this.user = this.apiService.user;
    }

    async logout() {
        await this.apiService.logout();

        this.router.navigateByUrl('/admin/login');
    }
}
