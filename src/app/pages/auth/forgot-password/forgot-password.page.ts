import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import errorMessages from 'src/app/shared/config/errors';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage implements OnInit {
    forgotForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
    });
    forgotErrors = {
        email: '',
    };

    resetForm = this.fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
    });
    resetErrors = {
        password: '',
        confirmPassword: '',
    };

    formMode: 'forgot' | 'sent' | 'reset' | 'error' = 'forgot';
    public formStatus: any = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private toast: ToastService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.forgotForm, (errors) => {
            this.forgotErrors = errors;
        });

        this.validatorService.validateOnInput(this.resetForm, (errors) => {
            this.resetErrors = errors;
        });

        // Get info from url
        const urlInfo = this.route.snapshot.fragment;
        if (urlInfo) {
            const urlParsed = new URLSearchParams(urlInfo);

            if (urlParsed.get('error') === 'access_denied') {
                this.formMode = 'error';
                return;
            }

            if (urlParsed.get('type') === 'recovery') {
                this.formMode = 'reset';
            }
        }
    }

    async sendForgotPasswordEmail() {
        try {
            const formResponse = this.validatorService.validateForm<
                typeof this.forgotForm
            >(this.forgotForm);
            if (!formResponse.valid) {
                this.forgotErrors = formResponse.errors;
                return;
            }

            this.formStatus = 'loading';

            const response =
                await this.apiService.supabase.auth.resetPasswordForEmail(
                    this.forgotForm.value.email!,
                    {
                        redirectTo: window.location.origin + '/forgot-password',
                    }
                );
            if (response.error) throw response.error;

            this.formStatus = '';
            this.formMode = 'sent';
        } catch (error: any) {
            this.formStatus = 'error';

            console.log(error);
        }
    }

    async resetPassword() {
        try {
            // Run validations
            const formResponse = this.validatorService.validateForm<
                typeof this.resetForm
            >(this.resetForm);
            if (!formResponse.valid) {
                this.resetErrors = formResponse.errors;
                return;
            }

            console.log(this.resetForm.value);

            this.formStatus = 'loading';
            const response = await this.apiService.supabase.auth.updateUser({
                password: this.resetForm.value.password!,
            });
            if (response.error) throw response.error;

            this.formStatus = '';
            this.apiService.isCustomerAuthenticated$.next(true);

            this.toast.createToast(
                'Success',
                'Your password has been successfully reset. Please log in now.',
                'success'
            );
            this.apiService.logout('/login');
        } catch (error: any) {
            this.formStatus = 'error';

            if (error.message.startsWith('ApiError')) {
                this.resetErrors.password =
                    errorMessages.validations['password']['invalid'];
            } else {
                this.toast.createToast(
                    'Something went wrong',
                    'There was an error resetting your password. Please try again in a minute.',
                    'error'
                );
            }
            console.log(error);
        }
    }

    public back() {
        this.formMode = 'forgot';
    }
}
