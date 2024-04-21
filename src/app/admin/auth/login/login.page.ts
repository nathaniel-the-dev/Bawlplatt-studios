import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ErrorService } from 'src/app/shared/services/error.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {
    loginForm = this.fb.group({
        email: [''],
        password: [''],
    });
    status: 'success' | 'error' | 'loading' | '' = '';
    error = '';

    constructor(
        private apiService: ApiService,
        private fb: UntypedFormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {}

    async onSubmit() {
        this.status = 'loading';
        const res = await this.apiService.login(this.loginForm.value);

        if (res.status === 'success') {
            this.status = 'success';
            this.showConfirmation();
        } else {
            this.status = 'error';
            this.renderError(res.error);
        }
    }

    showConfirmation(): void {
        setTimeout(() => {
            this.router.navigateByUrl('/admin');
        }, 1000);
    }

    hideError() {
        this.error = '';
    }

    renderError(err: any) {
        this.error = err.message;
    }
}
