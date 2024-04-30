import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });
    status: 'success' | 'error' | 'loading' | '' = '';
    errors = {
        email: '',
        password: '',
    };

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.form, (errors) => {
            this.errors = errors;
        });
    }

    async onSubmit() {
        const formResponse = this.validatorService.validate<typeof this.form>(
            this.form
        );
        if (!formResponse.valid) {
            this.errors = formResponse.errors;
            return;
        }

        this.status = 'loading';
        const { error } =
            await this.apiService.supabase.auth.signInWithPassword(
                this.form.value as any
            );

        if (error) {
            this.status = 'error';
            this.errors.email = error.message;
            return;
        }

        // Show confirmation
        this.status = 'success';
        setTimeout(() => {
            this.router.navigateByUrl('/admin');
        }, 600);
    }
}
