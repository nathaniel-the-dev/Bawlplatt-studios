import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.page.html',
    styleUrls: ['./user-list.page.css'],
})
export class UserListPage implements OnInit {
    public users: any[] = [];
    public currentUser: any;
    public loading = false;

    public searchTerm = '';
    public pagination = {
        current: 1,
        max: 1,
        limit: 5,
    };

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Get current user
        this.currentUser = this.apiService.user;

        // Get page from url (if any)
        const page = this.route.snapshot.queryParamMap.get('page');
        if (page) this.pagination.current = Number(page);

        // Get users
        this.getUsers();
    }

    async getUsers(): Promise<void> {
        this.loading = true;

        let query = this.apiService.supabase
            .from('profiles')
            .select('*, role:roles!inner(title)', { count: 'estimated' })
            .in('role.title', ['staff', 'admin'])
            .neq('uuid', this.currentUser.id)
            .neq('active', false)
            .order('created_at', { ascending: false });

        if (this.searchTerm) {
            query = query
                .ilike('name', `%${this.searchTerm}%`)
                .ilike('email', `%${this.searchTerm}%`);
        }

        const { data: profiles } = await this.apiService.paginateQuery(
            query,
            this.pagination
        );
        this.loading = false;

        if (!profiles) return;

        this.users = profiles;
    }

    public changePage(page: any) {
        this.pagination.current = page;
        this.getUsers();
    }

    public search(): void {
        this.pagination.current = 1;
        this.getUsers();
    }

    async sendVerificationEmail(user: any) {
        const res = await this.apiService.supabase.auth.resend({
            email: user.email,
            type: 'signup',
        });

        // TODO Preserve session
        console.log(res);

        this.toastService.createToast(
            'Email Sent',
            'A new verification email has been sent.'
        );
    }

    async confirmDisableAccount(user: any) {
        const confirmation = await this.toastService.openConfirmDeleteModal({
            title: 'Are you sure?',
            text: `This will permanently disable ${user.name}'s account.`,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });

        if (!confirmation) return;

        // Disable account
        const res = await this.apiService.admin.deleteUser(user.uuid, true);
        if (res.error) {
            this.toastService.createToast('Something went wrong', '', 'error');
            return;
        }

        // Deactivate profile
        await this.apiService.supabase
            .from('profiles')
            .update({ active: false })
            .eq('uuid', user.uuid);

        this.toastService.createToast(
            'Account Disabled',
            `${user.name}'s account has been disabled.`,
            'success'
        );

        // Reload page
        this.getUsers();
    }
}
