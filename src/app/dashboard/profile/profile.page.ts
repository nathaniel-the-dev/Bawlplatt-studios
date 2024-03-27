import { UntypedFormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit, OnDestroy {
    user?: User;

    infoForm = this.fb.group({
        name: [null],
        email: [null]
    });
    onInfoFormSubmit(): void {
        const infoSub = this.userService.updateCurrentUser(this.infoForm.value).subscribe((res) => {
            if (res.status === 'success') {
                this.user = res.data!['user'];
                this.userService.setUpdatedUser(this.user);

                this.infoForm.setValue({ name: this.user.name, email: this.user.email });
                this.infoForm.markAsPristine();

                this.toastService.createToast('Profile Updated', 'Your profile has been changed successfully');
            }

            if (res.status === 'fail' && res.error!.type === 'ValidationError') this.errorService.handleValidationError(res, this.infoForm);

        });
        this.subscriptions.add(infoSub);
    }

    passwordForm = this.fb.group({
        currentPassword: [null],
        password: [null],
        confirm: [null]
    });
    onPasswordFormSubmit(): void {
        const passwordSub = this.userService.updateCurrentUserPassword(this.passwordForm.value).subscribe((res) => {
            if (res.status === 'success') {
                this.passwordForm.reset();
                this.passwordForm.markAsPristine();
                this.toastService.createToast('Profile Updated', 'Your password has been changed successfully');
            }

            if (res.status === 'fail' && res.error!.type === 'ValidationError') this.errorService.handleValidationError(res, this.passwordForm);
        });
        this.subscriptions.add(passwordSub);
    }

    confirmAccountDelete(): void {
        this.toastService.openPasswordConfirmModal().then((password) => {
            console.log(password)
            if (!password) return;

            const verifySub = this.userService.verifyUser({ password }).subscribe((res) => {
                if (res.status === 'success') {
                    const deleteSub = this.userService.deleteCurrentUser().subscribe((res) => {
                        if (res !== null) return;

                        const loginSub = this.authService.logout().subscribe((res) => {
                            if (res.status === 'success') this.router.navigateByUrl('/login');
                        });
                        this.subscriptions.add(loginSub);
                    });
                    this.subscriptions.add(deleteSub);
                }

                if (res.status === 'fail' && res.error!.type === 'ValidationError') {
                    this.toastService.createToast('Incorrect Password', 'The password you entered was incorrect', 'error');
                }
            });
            this.subscriptions.add(verifySub);
        });
    }


    private subscriptions = new Subscription();

    constructor(private userService: UserService, private authService: AuthService, private toastService: ToastService, private errorService: ErrorService, private fb: UntypedFormBuilder, private router: Router) { }

    ngOnInit(): void {
        this.getUserInformation();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getUserInformation(): void {
        this.userService.getCurrentUser().subscribe((res) => {
            if (res.status !== 'success') return;

            this.user = res.data!['user'];
            this.infoForm.setValue({ name: this.user.name, email: this.user.email });

        });
    }


}
