import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-customer-dashboard',
    templateUrl: './customer-dashboard.page.html',
    styleUrls: ['./customer-dashboard.page.css'],
})
export class CustomerDashboardPage {
    constructor(private apiService: ApiService) {}

    logout() {
        this.apiService.logout('/');
    }
}
