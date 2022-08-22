import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit, OnDestroy {
    user?: User;

    infoForm = this.fb.group({
        name: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]]
    });
    onInfoFormSubmit(): void {
        const infoSub = this.userService.updateCurrentUser(this.infoForm.value).subscribe((res) => {
            if (res.status !== 'success') return;

            this.user = res.data!['user'];
            this.infoForm.setValue({ name: this.user.name, email: this.user.email });
        });
        this.subscriptions.add(infoSub);
    }

    passwordForm = this.fb.group({
        currentPassword: [null, Validators.required],
        newPassword: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(8)]]
    });
    onPasswordFormSubmit(): void {
        const passwordSub = this.userService.updateCurrentUserPassword(this.passwordForm.value).subscribe((res) => {
            if (res.status !== 'success') return;

            const loginSub = this.authService.login({
                email: this.user!.email,
                password: this.passwordForm.controls['newPassword'].value
            }).subscribe((res) => {
                if (res.status !== 'success') return;

                this.passwordForm.reset()
                window.alert('Profile updated!');
            });
            this.subscriptions.add(loginSub);
        });
        this.subscriptions.add(passwordSub);
    }

    confirmAccountDelete(): void {
        // TODO Request user password for confirmation of delete
        let password = window.prompt('Enter your password to confirm the delete:');
        if (!password) return;

        const verifySub = this.userService.verifyUser({ password }).subscribe((res) => {
            if (res.status !== 'success') return window.alert(res.message);

            const deleteSub = this.userService.deleteCurrentUser().subscribe((res) => {
                if (res !== null) return;

                const loginSub = this.authService.logout().subscribe((res) => {
                    if (res.status === 'success') this.router.navigateByUrl('/login');
                });
                this.subscriptions.add(loginSub);
            });
            this.subscriptions.add(deleteSub);
        });
        this.subscriptions.add(verifySub);
    }

    private subscriptions = new Subscription();

    constructor(private userService: UserService, private authService: AuthService, private fb: FormBuilder, private router: Router) { }

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
