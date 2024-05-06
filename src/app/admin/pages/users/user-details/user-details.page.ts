import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.page.html',
    styleUrls: ['./user-details.page.css'],
})
export class UserDetailsPage implements OnInit {
    public user: any;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.getUserInformation(id);
        } else {
            this.router.navigateByUrl('/admin/users');
        }
    }

    private async getUserInformation(id: string) {
        const { data: user } = await this.apiService.supabase
            .from('profiles')
            .select('*, role:roles(title)')
            .eq('id', id)
            .maybeSingle();

        if (user) this.user = user;
        else this.router.navigateByUrl('/404');
    }
}
