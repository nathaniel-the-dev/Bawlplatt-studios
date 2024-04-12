import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorComponent } from 'src/app/shared/components/error/error.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    imports: [
        CommonModule,
        FooterComponent,
        HeaderComponent,
        SharedComponentsModule,
        ReactiveFormsModule,
    ],
    standalone: true,
})
export class LoginPage implements OnInit, OnDestroy {
    loginForm = this.fb.group({
        email: [''],
        password: [''],
    });

    private subscriptions = new Subscription();

    constructor(
        private apiService: ApiService,
        private fb: UntypedFormBuilder,
        private router: Router,
        private errorService: ErrorService
    ) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    async onSubmit() {
        const res = await this.apiService.login(this.loginForm.value);

        if (res.status === 'success') this.showConfirmation();
    }

    showConfirmation(): void {
        // TODO Show confirmation animation on form
        // window.alert('Logged in successfully!');
        this.router.navigateByUrl('/dashboard/bookings');
    }
}
