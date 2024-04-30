import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage {
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
    });
    status: 'success' | 'error' | 'loading' | '' = '';
    error = '';

    showConfirmation = false;

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.form, (errors) => {
            this.error = errors.email;
        });
    }

    async onSubmit() {
        const formResponse = this.validatorService.validate<typeof this.form>(
            this.form
        );
        if (!formResponse.valid) {
            this.error = formResponse.errors.email;
            return;
        }

        this.status = 'loading';
        const { error } =
            await this.apiService.supabase.auth.resetPasswordForEmail(
                this.form.value.email!,
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
            this.error = '';
            this.showConfirmation = true;
        }
    }

    resetForm() {
        this.form.reset();
        this.status = '';
        this.error = '';
        this.showConfirmation = false;
    }

    renderError(err: any) {
        if (err.message.startsWith('Could not parse request')) {
            this.error = 'Invalid email address';
        } else {
            this.error = err.message;
        }
    }
}
