import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPhoneDirective } from './directives/format-phone.directive';
import { ErrorComponent } from './components/error/error.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormatContactNumPipe } from './pipes/format-contact-num.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { BookingsService } from './services/bookings.service';
import { ErrorService } from './services/error.service';
import { ToastService } from './services/toast.service';

const declarations = [
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    FormatPhoneDirective,
    FormatContactNumPipe,
    FormatDatePipe,
];

const modules: any[] = [];

@NgModule({
    declarations: [...declarations],
    imports: [CommonModule, ...modules],
    providers: [BookingsService, ErrorService, ToastService],
    exports: [...declarations, ...modules],
})
export class SharedComponentsModule {}
