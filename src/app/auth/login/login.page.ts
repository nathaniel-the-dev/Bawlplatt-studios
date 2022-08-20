import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/shared/error.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css']
})
export class LoginPage implements OnInit {
    loginForm!: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private errorService: ErrorService) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        this.userService.login(this.loginForm.value).subscribe((res) => {
            if (res.status === 'success') this.showConfirmation();
        });
    }

    showConfirmation(): void {
        // TODO Show confirmation animation on form
        // window.alert('Logged in successfully!');
        this.router.navigateByUrl('/dashboard');
    }
}
