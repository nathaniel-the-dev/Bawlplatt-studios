import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import generator from 'generate-password-ts';

type FormErrors = Record<
    keyof Omit<(typeof UserFormPage.prototype.userForm)['controls'], 'id'>,
    string
>;

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.page.html',
    styleUrls: ['./user-form.page.css'],
})
export class UserFormPage implements OnInit, AfterViewInit {
    @ViewChild('form') form?: FormGroupDirective;

    public userForm = this.fb.group({
        name: [
            null as string | null,
            [Validators.required, Validators.minLength(3)],
        ],
        email: [null as string | null, [Validators.required, Validators.email]],
        contact_number: [null as string | null, [Validators.minLength(10)]],
        role: [null as string | null, [Validators.required]],
        password: [
            null as string | null,
            [Validators.required, Validators.minLength(8)],
        ],
        confirm_password: [null as string | null, []],
        id: [null as string | null],
    });

    public errors: FormErrors = {
        name: '',
        email: '',
        contact_number: '',
        role: '',
        password: '',
        confirm_password: '',
    };

    public roles: any[] = [];
    public action: 'add' | 'edit' = 'add';
    private originalEmail = '';

    constructor(
        private apiService: ApiService,
        private toastService: ToastService,
        private validatorService: ValidatorService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Get roles
        this.getRoles();

        // Get user data if attempting to edit
        let id = this.route.snapshot.params['id'];
        if (id) {
            this.action = 'edit';
            this.userForm.controls.password.disable();
            this.userForm.controls.confirm_password.disable();

            this.getUserFromParams(id);
        } else {
            this.userForm.controls.id.disable();
        }
    }

    ngAfterViewInit(): void {
        // Validate fields when input changes
        this.validatorService.validateOnInput(
            this.userForm,
            (errors) => {
                this.errors = errors;
            },
            this.form
        );
    }

    async onSubmit() {
        const formResponse = this.validatorService.validateForm<
            typeof this.userForm
        >(this.userForm, this.form);

        if (!formResponse.valid) {
            this.errors = formResponse.errors;
            return;
        }

        try {
            if (this.action == 'add') await this.createUser();
            if (this.action == 'edit') await this.updateUser();
        } catch (error: any) {
            let message = error?.message || 'An error occurred';

            if (
                message.includes('email address') ||
                message.includes(
                    'duplicate key value violates unique constraint "users_email_partial_key"'
                )
            ) {
                this.userForm.controls.email.setErrors({
                    async: 'Email already in use',
                });
                this.userForm.updateValueAndValidity();
            }
        }
    }

    private async createUser() {
        // Create user
        const userRes = await this.apiService.superAdmin.createUser({
            email: this.userForm.value.email!,
            password: this.userForm.value.password!,
            email_confirm: true,
        });
        if (userRes.error) throw userRes.error;

        // Add user profile info
        const profileRes = await this.apiService.supabase
            .from('profiles')
            .insert([
                {
                    name: this.userForm.value.name!,
                    email: this.userForm.value.email!,
                    contact_num: this.userForm.value.contact_number
                        ? parseInt(this.userForm.value.contact_number)
                        : null,
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
    }

    private async updateUser() {
        let emailChanged = this.userForm.value.email !== this.originalEmail;
        if (emailChanged) {
            const userRes = await this.apiService.superAdmin.updateUserById(
                this.userForm.value.id!,
                {
                    email: this.userForm.value.email!,
                }
            );

            if (userRes.error) throw userRes.error;
        }

        const profileRes = await this.apiService.supabase
            .from('profiles')
            .update({
                name: this.userForm.value.name!,
                email: this.userForm.value.email!,
                contact_num: this.userForm.value.contact_number
                    ? parseInt(this.userForm.value.contact_number)
                    : null,
                role: this.userForm.value.role,
            })
            .eq('uuid', this.userForm.value.id!);

        if (profileRes.error) throw profileRes.error;

        // TODO Add audit log

        // Redirect to users page
        this.toastService.createToast(
            'User Updated',
            'User has been updated successfully',
            'success'
        );

        this.router.navigateByUrl('/admin/users');
    }

    public generatePassword() {
        const password = generator.generate({
            length: 8,
            numbers: true,
        });
        this.userForm.controls.password.setValue(password);
        this.userForm.controls.confirm_password.setValue(password);
    }

    public copyPassword() {
        if (this.userForm.controls.password.value) {
            navigator.clipboard.writeText(
                this.userForm.controls.password.value
            );
            this.toastService.createToast(
                'Password Copied',
                'Password has been copied to clipboard',
                'success'
            );
        }
    }

    private async getRoles() {
        const { data } = await this.apiService.supabase
            .from('roles')
            .select('*')
            .eq('admin_only', true);
        if (data) this.roles = data;
    }

    private async getUserFromParams(id: string) {
        const { data: user } = await this.apiService.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (user) {
            this.userForm.patchValue({
                ...user,
                contact_number: user.contact_num?.toString(),
                id: user.uuid,
            });

            this.originalEmail = user.email;
        } else {
            this.router.navigateByUrl('/admin/users');
        }
    }
}
