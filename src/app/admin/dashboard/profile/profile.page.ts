import { UntypedFormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { User } from '@supabase/supabase-js';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.css'],
})
export class ProfilePage implements OnInit, OnDestroy {
    user: User | null = null;

    infoForm = this.fb.group({
        name: [null],
        email: [null],
    });

    passwordForm = this.fb.group({
        currentPassword: [null],
        password: [null],
        confirm: [null],
    });

    private subscriptions = new Subscription();

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private errorService: ErrorService,
        private fb: UntypedFormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getUserInformation();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    async onInfoFormSubmit() {
        const res = await this.apiService.sendRequest({
            table: 'users',
            method: 'update',
            data: this.infoForm.value,
        });

        if (!res.error) {
            this.infoForm.markAsPristine();

            this.toastService.createToast(
                'Profile Updated',
                'Your profile has been changed successfully'
            );
        } else {
            this.errorService.handleValidationError(res, this.infoForm);
        }
    }

    async onPasswordFormSubmit() {
        // Verify password

        // Update password

        this.passwordForm.reset();
        this.passwordForm.markAsPristine();
        this.toastService.createToast(
            'Profile Updated',
            'Your password has been changed successfully'
        );
    }

    async confirmAccountDelete() {
        this.toastService.openPasswordConfirmModal().then((password) => {
            if (!password) return;

            // Verify password

            // Delete user (if verified)

            //   this.toastService.createToast(
            //       'Incorrect Password',
            //       'The password you entered was incorrect',
            //       'error'
            //   );
        });
    }

    private async getUserInformation() {
        this.user = this.apiService.user!;

        this.infoForm.setValue({
            name: this.user.user_metadata['first_name'],
            email: this.user.email,
        });
    }
}
