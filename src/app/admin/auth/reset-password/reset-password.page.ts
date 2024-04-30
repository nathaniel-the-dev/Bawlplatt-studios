import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

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
        private fb: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    private subscription = new Subscription();

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription.add(
            this.form.valueChanges.subscribe(() => {
                this.validateForm();
            })
        );

        const error = this.route.snapshot.fragment;
        if (error) {
            const parsed = new URLSearchParams(error);
            this.urlError = parsed.get('error_description') ?? '';
        }
    }

    private validateForm() {
        Object.keys(this.form.controls).forEach((control) => {
            // Validate each input control
            if (this.form.get(control)?.invalid) {
                const [key, value] = Object.entries(
                    this.form.get(control)!.errors!
                )[0];

                this.errors[control as keyof typeof this.errors] = (() => {
                    if (!value) return '';

                    switch (key) {
                        case 'required':
                            return 'This field is required';
                        case 'async':
                        default:
                            return typeof value === 'string'
                                ? value
                                : 'This field is invalid';
                    }
                })();
            }
        });
    }

    async onSubmit() {
        this.validateForm();
        if (this.form.invalid) return;

        this.status = 'loading';
        const { error } = await this.apiService.supabase.auth.updateUser({
            password: this.form.value.password,
        });

        if (error) {
            this.status = 'error';
            // this.renderError(error);
        } else {
            await this.apiService.logout();
            this.router.navigateByUrl('/admin/login');
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
