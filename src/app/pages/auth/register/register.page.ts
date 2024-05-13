import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider } from '@supabase/supabase-js';
import errorMessages from 'src/app/shared/config/errors';
import { ApiService } from 'src/app/shared/services/api.service';
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

    customerRoleId: string = '';
    formMode: 'signup' | 'submitted' = 'signup';
    formStatus: 'loading' | 'success' | 'error' | '' = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
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
            const secretToken = Math.floor(100000 + Math.random() * 900000);
            const response = await this.apiService.supabase.auth.signUp({
                email: this.registerForm.value.email!,
                password: this.registerForm.value.password!,
                options: {
                    emailRedirectTo:
                        window.location.origin + `verified/${secretToken}`,
                },
            });
            if (response.error) throw response.error;

            // Check if email is a unique email
            if (
                response.data.user?.email === this.registerForm.value.email &&
                response.data.user?.email_confirmed_at !== null
            ) {
                this.formStatus = 'error';
                this.registerForm.controls.email.setErrors({
                    unique: true,
                });
                this.errors.email =
                    errorMessages.validations['email']['unique'];
                return;
            }

            // Notify user of success and let them know to check email for verification
            this.formStatus = 'success';
            this.formMode = 'submitted';
        } catch (error) {
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
        } catch (error) {
            console.error(error);
        }
    }
}
