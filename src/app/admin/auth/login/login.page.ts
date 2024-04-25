import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {
    form = this.fb.group({
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

    private subscription = new Subscription();

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription.add(
            this.form.valueChanges.subscribe(() => {
                this.hideError();
            })
        );
    }

    async onSubmit() {
        this.status = 'loading';
        const { error } =
            await this.apiService.supabase.auth.signInWithPassword(
                this.form.value
            );

        if (error) {
            this.status = 'error';
            this.renderError(error);
            return;
        }

        // Show confirmation
        this.status = 'success';
        setTimeout(() => {
            this.router.navigateByUrl('/admin');
        }, 600);
    }

    hideError() {
        this.error = '';
    }

    renderError(err: any) {
        this.error = err.message;
    }
}
