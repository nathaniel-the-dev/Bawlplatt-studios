import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css']
})
export class LoginPage implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    subscriptions: Subscription = new Subscription();

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private errorService: ErrorService) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onSubmit(): void {
        const loginSub = this.authService.login(this.loginForm.value).subscribe((res) => {
            if (res.status === 'success') this.showConfirmation();
        });

        this.subscriptions.add(loginSub);
    }

    showConfirmation(): void {
        // TODO Show confirmation animation on form
        // window.alert('Logged in successfully!');
        this.router.navigateByUrl('/dashboard');
    }
}
