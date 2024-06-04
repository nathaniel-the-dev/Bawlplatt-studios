import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Provider } from '@supabase/supabase-js';
import errorMessages from 'src/app/shared/config/errors';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    verifyForm = this.fb.group({
        otp: ['', [Validators.required, Validators.minLength(6)]],
    });
    verifyErrors = {
        otp: '',
    };

    errors = {
        email: '',
        password: '',
    };

    formMode: 'login' | 'submitted' | 'verify' = 'login';
    public formStatus: any = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private router: Router,
        private fb: FormBuilder,
        private toast: ToastService
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.loginForm, (errors) => {
            this.errors = errors;
        });
        this.validatorService.validateOnInput(this.verifyForm, (errors) => {
            this.verifyErrors = errors;
        });
    }

    async onSubmit() {
        try {
            const formResponse = this.validatorService.validateForm<
                typeof this.loginForm
            >(this.loginForm);
            if (!formResponse.valid) {
                this.errors = formResponse.errors;
                return;
            }

            this.formStatus = 'loading';
            const response =
                await this.apiService.supabase.auth.signInWithPassword({
                    email: this.loginForm.value.email!,
                    password: this.loginForm.value.password!,
                });
            if (response.error) throw response.error;

            if (
                !response.data?.user?.user_metadata['profile']?.['verified_at']
            ) {
                this.formMode = 'verify';

                this.apiService.supabase.auth.signOut();

                this.apiService.supabase.auth.signInWithOtp({
                    email: this.loginForm.value.email!,
                    options: {
                        shouldCreateUser: false,
                    },
                });
            } else {
                this.apiService.isCustomerAuthenticated$.next(true);
                this.router.navigate(['/']);
            }
            this.formStatus = '';
        } catch (error: any) {
            if (error.message === 'Invalid login credentials') {
                this.loginForm.controls.email.setErrors({
                    async: errorMessages.validations['email']['async'],
                });
                this.loginForm.controls.email.updateValueAndValidity();
                this.errors.email = errorMessages.validations['email']['async'];
            }

            this.formStatus = 'error';
        }
    }

    async onVerify() {
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

            const { error } = await this.apiService.supabase.auth.verifyOtp({
                email: this.loginForm.value.email!,
                token: this.verifyForm.value.otp!,
                type: 'email',
            });
            if (error) throw error;

            const { error: updateError } =
                await this.apiService.supabase.auth.updateUser({
                    data: {
                        verified_at: new Date(),
                    },
                });
            if (updateError) {
                this.apiService.supabase.auth.signOut();
                throw updateError;
            }

            this.apiService.isCustomerAuthenticated$.next(true);
            this.formStatus = '';
            this.router.navigate(['/']);
        } catch (error) {
            this.formStatus = 'error';
            this.verifyErrors.otp = errorMessages.validations['otp']['invalid'];
        }
    }

    async resendCode() {
        try {
            this.formStatus = 'loading';
            const res = await this.apiService.supabase.auth.signInWithOtp({
                email: this.loginForm.value.email!,
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

    async handleSocialLogin(provider: Provider) {
        try {
            const response =
                await this.apiService.supabase.auth.signInWithOAuth({
                    provider,
                    options: {
                        redirectTo: window.location.origin + '/login',
                    },
                });
            if (response.error) throw response.error;
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    public back() {
        this.verifyForm.reset();
        this.formMode = 'login';
    }
}
