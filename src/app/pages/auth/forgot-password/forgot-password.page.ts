import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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

    verifyForm = this.fb.group({
        otp: ['', [Validators.required, Validators.minLength(6)]],
    });
    verifyErrors = {
        otp: '',
    };

    resetForm = this.fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
    });
    resetErrors = {
        email: '',
    };

    formMode: 'forgot' | 'verify' | 'reset' = 'forgot';
    public formStatus: any = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private router: Router,
        private fb: FormBuilder,
        private toast: ToastService
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.forgotForm, (errors) => {
            this.forgotErrors = errors;
        });
        this.validatorService.validateOnInput(this.verifyForm, (errors) => {
            this.verifyErrors = errors;
        });
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

            // Check if email is a unique email
            const { data: profile, error: profileError } =
                await this.apiService.supabase
                    .from('profiles, roles!inner(title)')
                    .select('id')
                    .eq('email', this.forgotForm.value.email)
                    .eq('role.title', 'customer')
                    .maybeSingle();
            if (profileError) throw profileError;

            if (profile) {
                this.formStatus = 'error';
                this.forgotForm.controls.email.setErrors({
                    not_found: true,
                });
                this.forgotErrors.email =
                    errorMessages.validations['email']['not_found'];
                return;
            }

            const response = await this.apiService.supabase.auth.signInWithOtp({
                email: this.forgotForm.value.email!,
                options: {
                    shouldCreateUser: false,
                },
            });
            if (response.error) throw response.error;

            this.formStatus = '';
            this.formMode = 'verify';
        } catch (error: any) {
            this.formStatus = 'error';

            if (error.message.includes('Signups not allowed for otp')) {
                this.forgotForm.controls.email.setErrors({
                    not_found: true,
                });
                this.forgotForm.controls.email.updateValueAndValidity();
                this.forgotErrors.email =
                    errorMessages.validations['email']['not_found'];
            }
        }
    }

    async verifyOTP() {
        try {
            // Run validations
            const formResponse = this.validatorService.validateForm<
                typeof this.verifyForm
            >(this.verifyForm);
            if (!formResponse.valid) {
                this.verifyErrors = formResponse.errors;
                return;
            }

            this.formStatus = 'loading';
            const response = await this.apiService.supabase.auth.verifyOtp({
                email: this.forgotForm.value.email!,
                token: this.verifyForm.value.otp!,
                type: 'email',
            });
            if (response.error) throw response.error;

            this.apiService.logout();
            this.formStatus = '';
            this.formMode = 'reset';
        } catch (error) {
            this.formStatus = 'error';
            this.verifyErrors.otp = errorMessages.validations['otp']['invalid'];
        }
    }

    async resendCode() {
        try {
            this.formStatus = 'loading';
            const res = await this.apiService.supabase.auth.signInWithOtp({
                email: this.forgotForm.value.email!,
                options: {
                    shouldCreateUser: false,
                },
            });
            if (res.error) throw res.error;
            this.formStatus = '';
        } catch (error: any) {
            this.formStatus = 'error';
            this.toast.createToast(
                'Something went wrong',
                'There was an error sending your token. Please try again in a minute.',
                'error'
            );
        }
    }

    async resetPassword() {
        try {
            this.formStatus = 'loading';
            const response = await this.apiService.supabase.auth.updateUser({
                data: {
                    password: this.resetForm.value.password,
                },
            });
            if (response.error) throw response.error;

            this.formStatus = '';
            this.router.navigate(['/']);
            this.apiService.isCustomerAuthenticated$.next(true);
        } catch (error) {
            console.log(error);
        }
    }

    public back() {
        this.verifyForm.reset();
        this.formMode = 'forgot';
    }
}
