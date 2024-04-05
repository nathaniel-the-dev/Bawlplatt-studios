import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit, OnDestroy {
    loginForm = this.fb.group({
        email: [''],
        password: [''],
    });

    private subscriptions = new Subscription();

    constructor(
        private fb: UntypedFormBuilder,
        private router: Router,
        private authService: AuthService,
        private errorService: ErrorService
    ) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onSubmit(): void {
        const loginSub = this.authService
            .login(this.loginForm.value)
            .subscribe((res) => {
                if (res.status === 'success') this.showConfirmation();
                if (
                    res.status === 'fail' &&
                    res.error!.type === 'ValidationError'
                )
                    this.errorService.handleValidationError(
                        res,
                        this.loginForm
                    );
            });

        this.subscriptions.add(loginSub);
    }

    showConfirmation(): void {
        // TODO Show confirmation animation on form
        // window.alert('Logged in successfully!');
        this.router.navigateByUrl('/dashboard/bookings');
    }
}
