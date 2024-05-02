import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class UserFormPage implements OnInit, AfterViewInit {
    @ViewChild('form') form?: FormGroupDirective;

    public userForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        contact_num: [null, []],
        role: [null, [Validators.required]],
        password: [null, [Validators.required]],
        confirm_password: [null, []],
    });

    public errors: Record<keyof (typeof this.userForm)['controls'], string> = {
        name: '',
        email: '',
        contact_num: '',
        role: '',
        password: '',
        confirm_password: '',
    };

    public roles: any[] = [];

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Get roles
        this.getRoles();
    }

    ngAfterViewInit(): void {
        this.validatorService.validateOnInput(
            this.userForm,
            (errors) => {
                this.errors = errors;
            },
            this.form
        );
    }

    async onSubmit() {
        const formResponse = this.validatorService.validate<
            typeof this.userForm
        >(this.userForm, this.form);

        if (!formResponse.valid) {
            this.errors = formResponse.errors;
            return;
        }

        // Create user
        try {
            const userRes =
                await this.apiService.adminClient.auth.admin.createUser({
                    email: this.userForm.value.email!,
                    password: this.userForm.value.password!,
                    email_confirm: false,
                });
            if (userRes.error) throw userRes.error;

            // Add user profile info
            const profileRes = await this.apiService.supabase
                .from('profiles')
                .insert([
                    {
                        name: this.userForm.value.name!,
                        email: this.userForm.value.email!,
                        contact_num: this.userForm.value.contact_num || null,
                        uuid: userRes.data.user!.id,
                        role: this.userForm.value.role,
                        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${this.userForm.value.name}&backgroundColor=000000`,
                    },
                ]);
            if (profileRes.error) throw profileRes.error;

            // TODO Add audit log

            // Redirect to users page
            this.toastService.createToast(
                'User Created',
                'User has been created successfully',
                'success'
            );
            this.router.navigateByUrl('/admin/users');
        } catch (error: any) {
            let message = error.message;

            if (message.includes('email address')) {
                this.userForm.controls.email.setErrors({ async: message });
                this.userForm.updateValueAndValidity();
            }
        }
    }

    private async getRoles() {
        const { data } = await this.apiService.supabase
            .from('roles')
            .select('*')
            .eq('admin_only', true);
        if (data) this.roles = data;
    }
}
