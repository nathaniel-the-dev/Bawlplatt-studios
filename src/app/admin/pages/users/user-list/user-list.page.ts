import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.page.html',
    styleUrls: ['./user-list.page.css'],
})
export class UserListPage implements OnInit {
    public users: any[] = [];
    public currentUser: any;
    public loading = false;

    public pagination = {
        current: 1,
        max: 1,
    };

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.currentUser = this.apiService.user;
        this.getUsers();
    }

    async getUsers(): Promise<void> {
        this.loading = true;
        const { data: profiles } = await this.apiService.supabase
            .from('profiles')
            .select('*, role:roles!inner(title)')
            .in('role.title', ['staff', 'admin']);
        this.loading = false;

        if (!profiles) return;

        this.users = profiles;
    }
}
