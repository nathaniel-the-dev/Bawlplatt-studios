import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPhoneDirective } from './directives/format-phone.directive';
import { ErrorComponent } from './components/error/error.component';
import { FormatContactNumPipe } from './pipes/format-contact-num.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { ErrorService } from './services/error.service';
import { ToastService } from './services/toast.service';
import { ApiService } from './services/api.service';

const declarations = [
    ErrorComponent,
    FormatPhoneDirective,
    FormatContactNumPipe,
    FormatDatePipe,
];

const modules: any[] = [];

@NgModule({
    declarations: [...declarations],
    imports: [CommonModule, ...modules],
    providers: [ApiService, ErrorService, ToastService],
    exports: [...declarations, ...modules],
})
export class SharedComponentsModule {}
