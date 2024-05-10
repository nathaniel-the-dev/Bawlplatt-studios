import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Provider } from '@supabase/supabase-js';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
})
export class LoginPage {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    errors = {
        email: '',
        password: '',
    };

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    async onSubmit() {
        try {
            const formResponse = this.validatorService.validate<
                typeof this.loginForm
            >(this.loginForm);
            if (!formResponse.valid) {
                this.errors = formResponse.errors;
                return;
            }

            const response =
                await this.apiService.supabase.auth.signInWithPassword({
                    email: this.loginForm.value.email!,
                    password: this.loginForm.value.password!,
                });
            if (response.error) throw response.error;
            console.log(response);
        } catch (error) {
            console.error(error);
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
