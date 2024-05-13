import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPhoneDirective } from './directives/format-phone.directive';
import { ErrorComponent } from './components/error/error.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ConfirmPasswordValidatorDirective } from './directives/confirm-password.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { DurationPipe } from './pipes/duration.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { PasswordToggleDirective } from './directives/password-toggle.directive';
import {
    LucideAngularModule,
    Guitar,
    Speaker,
    Drum,
    Piano,
    Mic2,
} from 'lucide-angular';
import { StatusIndicatorComponent } from './components/status-indicator/status-indicator.component';

const declarations = [
    ErrorComponent,

    FormatPhoneDirective,
    ConfirmPasswordValidatorDirective,
    PasswordToggleDirective,

    FormatDatePipe,
    DurationPipe,

    HeaderComponent,
    FooterComponent,
    StatusIndicatorComponent,
];

const modules: any[] = [
    RouterModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
    LucideAngularModule.pick({ Guitar, Speaker, Drum, Piano, Mic2 }),
];

@NgModule({
    declarations: [...declarations],
    imports: [CommonModule, ...modules],
    exports: [...declarations, ...modules],
})
export class SharedComponentsModule {}
