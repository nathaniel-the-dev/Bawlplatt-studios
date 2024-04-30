import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage {
    form = this.fb.group({
        email: [''],
    });
    status: 'success' | 'error' | 'loading' | '' = '';
    error = '';

    showConfirmation = false;

    constructor(
        private apiService: ApiService,
        private fb: UntypedFormBuilder
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
            await this.apiService.supabase.auth.resetPasswordForEmail(
                this.form.value.email,
                {
                    redirectTo:
                        window.location.origin + '/admin/reset-password',
                }
            );

        if (error) {
            this.status = 'error';
            this.renderError(error);
        } else {
            this.status = 'success';
            setTimeout(() => {
                this.status = '';
            }, 600);
            this.hideError();
            this.showConfirmation = true;
        }
    }

    resetForm() {
        this.form.reset();
        this.status = '';
        this.error = '';
        this.showConfirmation = false;
    }

    hideError() {
        this.error = '';
    }

    renderError(err: any) {
        if (err.message.startsWith('Could not parse request')) {
            this.error = 'Invalid email address';
        } else {
            this.error = err.message;
        }
    }
}
