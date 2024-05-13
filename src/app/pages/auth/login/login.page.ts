import { Component, OnInit } from '@angular/core';
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
export class LoginPage implements OnInit {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    errors = {
        email: '',
        password: '',
    };

    public formStatus: any = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.loginForm, (errors) => {
            this.errors = errors;
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

            console.log(response);
            this.formStatus = 'success';
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
