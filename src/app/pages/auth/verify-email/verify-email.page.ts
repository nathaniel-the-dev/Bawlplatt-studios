import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.page.html',
    styleUrls: ['./verify-email.page.css'],
})
export class VerifyEmailPage implements OnInit {
    infoForm = this.fb.group({
        name: ['', [Validators.required]],
        contact_num: ['', [Validators.required]],
    });

    errors = {
        name: '',
        contact_num: '',
    };
    formStatus: any = '';

    constructor(
        private apiService: ApiService,
        private validatorService: ValidatorService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        if (this.route.snapshot.params['token']) {
        }

        this.validatorService.validateOnInput(this.infoForm, (errors) => {
            this.errors = errors;
        });
    }

    async onSubmit() {
        try {
            // Run validations
            const formResponse = this.validatorService.validateForm<
                typeof this.infoForm
            >(this.infoForm);
            if (!formResponse.valid) {
                this.errors = formResponse.errors;
                return;
            }

            // Sign user up
            this.formStatus = 'loading';
            const response = await this.apiService.supabase.auth.updateUser({
                data: {
                    name: this.infoForm.value.name!,
                    contact_num: this.infoForm.value.contact_num!,
                },
            });
            if (response.error) throw response.error;

            this.formStatus = 'success';
        } catch (error) {
            console.error(error);
            this.formStatus = 'error';
        }
    }
}
