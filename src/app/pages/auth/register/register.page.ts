import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {
    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
    });

    errors = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    role: string = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.getCustomerRoleId();
    }

    private async getCustomerRoleId() {
        const { data } = await this.apiService.supabase
            .from('roles')
            .select('id')
            .eq('name', 'customer')
            .maybeSingle();
        this.role = data!.id;
    }

    async onSubmit() {
        try {
            const formResponse = this.validatorService.validate<
                typeof this.registerForm
            >(this.registerForm);
            if (!formResponse.valid) {
                this.errors = formResponse.errors;
                return;
            }

            const response = await this.apiService.supabase.auth.signUp({
                email: this.registerForm.value.email!,
                password: this.registerForm.value.password!,
            });
            if (response.error) throw response.error;

            const profileResponse = await this.apiService.supabase
                .from('profiles')
                .insert([
                    {
                        name: this.registerForm.value.name!,
                        email: this.registerForm.value.email!,
                        role: this.role,
                    },
                ]);
            console.log(response, profileResponse);
        } catch (error) {
            console.error(error);
        }
    }
}
