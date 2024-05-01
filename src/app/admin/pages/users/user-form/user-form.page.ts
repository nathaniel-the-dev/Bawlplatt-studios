import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.page.html',
    styleUrls: ['./user-form.page.css'],
})
export class UserFormPage implements OnInit {
    @ViewChild('form') form?: FormGroupDirective;

    public userForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        contact_num: [null, [Validators.required]],
        role: [null, [Validators.required]],
        password: [null, [Validators.required]],
        confirm_password: [null, [Validators.required]],
    });

    public errors: Record<keyof (typeof this.userForm)['controls'], string> = {
        name: '',
        email: '',
        contact_num: '',
        role: '',
        password: '',
        confirm_password: '',
    };

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {}

    async onSubmit() {
        const formResponse = this.validatorService.validate<
            typeof this.userForm
        >(this.userForm);

        if (!formResponse.valid) {
            this.errors = formResponse.errors;
            return;
        }

        // Create user

        // Redirect to users page
    }
}
