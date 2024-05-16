import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Provider } from '@supabase/supabase-js';
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
    code = '';

    errors = {
        email: '',
        password: '',
        confirm_password: '',
    };

    customerRoleId: string = '';
    formMode: 'signup' | 'submitted' | 'verified' = 'signup';
    formStatus: 'loading' | 'success' | 'error' | '' = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private toast: ToastService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.getCustomerRoleId();

        this.validatorService.validateOnInput(this.registerForm, (errors) => {
            this.errors = errors;
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
            await this.apiService.supabase.auth.signOut();

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
                this.apiService.admin.deleteUser(user!.id);
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

            // Notify user of success and let them know to check email for verification
            this.formStatus = '';
            this.formMode = 'submitted';
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
        this.formStatus = 'loading';

        // Verify OTP code
        try {
            const { data, error } =
                await this.apiService.supabase.auth.verifyOtp({
                    email: this.registerForm.value.email!,
                    token: this.code,
                    type: 'email',
                });
            if (error) throw error;

            // Set user as verified
            this.apiService.supabase.auth.updateUser({
                data: { verified_at: new Date() },
            });

            // Notify user and redirect to dashboard
            this.formStatus = '';
            this.formMode = 'verified';
        } catch (error: any) {
            console.error(error);
            this.formStatus = 'error';
        }
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
