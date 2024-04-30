import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.css'],
})
export class ResetPasswordPage {
    form = this.fb.group({
        password: ['', [Validators.required]],
        confirm_password: [''],
    });
    status: 'success' | 'error' | 'loading' | '' = '';

    errors = {
        password: '',
        confirm_password: '',
    };
    urlError = '';

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.validatorService.validateOnInput(this.form, (errors) => {
            this.errors = errors;
        });

        const error = this.route.snapshot.fragment;
        if (error) {
            const urlParsed = new URLSearchParams(error);
            this.urlError = urlParsed.get('error_description') ?? '';
        }
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
        const { error } = await this.apiService.supabase.auth.updateUser({
            password: this.form.value.password!,
        });

        if (!error) {
            await this.apiService.logout();
            this.router.navigateByUrl('/admin/login');
            this.toastService.createToast(
                'Success',
                'Your password has been reset. Please log in now.',
                'success'
            );
        } else {
            this.status = 'error';
            this.toastService.createToast(
                'Something went wrong',
                error.message,
                'error'
            );
        }
    }

    hideError() {
        this.errors = {
            password: '',
            confirm_password: '',
        };
    }

    // renderError(err: any) {
    //     if (err.message.startsWith('Could not parse request')) {
    //         this.error = 'Invalid email address';
    //     } else {
    //         this.error = err.message;
    //     }
    // }
}
