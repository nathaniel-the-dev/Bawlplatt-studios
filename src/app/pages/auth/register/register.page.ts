import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Provider } from '@supabase/supabase-js';
import errors from 'src/app/shared/config/errors';
import errorMessages from 'src/app/shared/config/errors';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {
    registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
    });
    errors = {
        email: '',
        password: '',
        confirm_password: '',
    };

    verifyForm = this.fb.group({
        otp: ['', [Validators.required, Validators.minLength(6)]],
    });
    verifyErrors = {
        otp: '',
    };

    completeForm = this.fb.group({
        name: ['', [Validators.required]],
        contact_num: ['', [Validators.required]],
    });
    completeErrors = {
        name: '',
        contact_num: '',
    };

    customerRoleId: string = '';
    formMode: 'signup' | 'verify' | 'completeSignup' = 'signup';
    formStatus: 'loading' | 'success' | 'error' | '' = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private toast: ToastService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getCustomerRoleId();

        this.validatorService.validateOnInput(this.registerForm, (errors) => {
            this.errors = errors;
        });
        this.validatorService.validateOnInput(this.verifyForm, (errors) => {
            this.verifyErrors = errors;
        });
        this.validatorService.validateOnInput(this.completeForm, (errors) => {
            this.completeErrors = errors;
        });
    }

    private async getCustomerRoleId() {
        const { data } = await this.apiService.supabase
            .from('roles')
            .select('id')
            .eq('title', 'customer')
            .maybeSingle();
        this.customerRoleId = data!.id;
    }

    async onSubmit() {
        try {
            // Run validations
            const formResponse = this.validatorService.validateForm<
                typeof this.registerForm
            >(this.registerForm);
            if (!formResponse.valid) {
                this.errors = formResponse.errors;
                return;
            }

            // Sign user up
            this.formStatus = 'loading';

            // Check if email is a unique email
            const { data: profile } = await this.apiService.supabase
                .from('profiles')
                .select('id')
                .eq('email', this.registerForm.value.email)
                .maybeSingle();

            if (profile) {
                this.formStatus = 'error';
                this.registerForm.controls.email.setErrors({
                    unique: true,
                });
                this.errors.email =
                    errorMessages.validations['email']['unique'];
                return;
            }

            // Create account
            const {
                data: { user },
                error,
            } = await this.apiService.supabase.auth.signUp({
                email: this.registerForm.value.email!,
                password: this.registerForm.value.password!,
            });
            if (error) throw error;
            await this.apiService.logout();

            // Create user profile
            const { error: profileError } = await this.apiService.supabase
                .from('profiles')
                .insert([
                    {
                        email: this.registerForm.value.email!,
                        role: this.customerRoleId,
                        uuid: user?.id,
                    },
                ]);
            if (profileError) {
                this.apiService.superAdmin.deleteUser(user!.id);
                throw profileError;
            }

            // Send an OTP to the user's email
            const res = await this.apiService.supabase.auth.signInWithOtp({
                email: this.registerForm.value.email!,
                options: {
                    shouldCreateUser: false,
                },
            });
            if (res.error) throw res.error;
            await this.apiService.logout();

            // Notify user of success and let them know to check email for verification
            this.formStatus = '';
            this.formMode = 'verify';
        } catch (error) {
            console.error(error);
            this.formStatus = 'error';
            this.toast.createToast(
                'Something went wrong',
                'There was an error creating your account',
                'error'
            );
        }
    }

    async onVerify() {
        // Verify OTP code
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
            const {
                data: { user },
                error,
            } = await this.apiService.supabase.auth.verifyOtp({
                email: this.registerForm.value.email!,
                token: this.verifyForm.value.otp!,
                type: 'email',
            });
            if (error) {
                throw error;
            }

            // Set user as verified
            const { data: profile } = await this.apiService.supabase
                .from('profiles')
                .update([
                    {
                        verified_at: new Date(),
                    },
                ])
                .eq('uuid', user!.id)
                .select('*')
                .maybeSingle();

            await this.apiService.supabase.auth.updateUser({
                data: {
                    profile,
                },
            });

            // Get additional details from the user
            this.apiService.isCustomerAuthenticated$.next(true);
            this.formMode = 'completeSignup';
            this.formStatus = '';
        } catch (error: any) {
            this.verifyErrors.otp = errors.validations['otp']['invalid'];
            this.formStatus = 'error';
        }
    }

    async onCompleteSignup() {
        // Complete user registration
        try {
            // Run validations
            const formResponse = this.validatorService.validateForm<
                typeof this.completeForm
            >(this.completeForm);
            if (!formResponse.valid) {
                this.completeErrors = formResponse.errors;
                return;
            }

            this.formStatus = 'loading';
            const { data: profile, error } = await this.apiService.supabase
                .from('profiles')
                .update({
                    name: this.completeForm.value.name!,
                    contact_num: this.completeForm.value.contact_num!,
                    avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${this.completeForm.value.name}`,
                })
                .eq('uuid', this.apiService.user!.id)
                .select('*')
                .maybeSingle();
            if (error) throw error;

            await this.apiService.supabase.auth.updateUser({
                data: {
                    profile,
                },
            });

            this.formStatus = 'success';
            this.toast.createToast(
                'Welcome to Bawlplatt Studios',
                'Your account has been created successfully',
                'success'
            );
            this.router.navigate(['/dashboard']);
        } catch (error) {
            this.formStatus = 'error';
            console.error(error);
        }
    }

    async resendCode() {
        try {
            this.formStatus = 'loading';
            const res = await this.apiService.supabase.auth.signInWithOtp({
                email: this.registerForm.value.email!,
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

    public back() {
        this.verifyForm.reset();
        this.formMode = 'signup';
    }

    async handleSocialLogin(provider: Provider) {
        try {
            const response =
                await this.apiService.supabase.auth.signInWithOAuth({
                    provider,
                });
            if (response.error) throw response.error;
            console.log(response);
        } catch (error: any) {
            console.error(error);
            this.toast.createToast(
                'Something went wrong',
                'There was an error creating your account',
                'error'
            );
        }
    }
}
