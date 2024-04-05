import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    declarations: [],
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
})
export class AdminModule {}
