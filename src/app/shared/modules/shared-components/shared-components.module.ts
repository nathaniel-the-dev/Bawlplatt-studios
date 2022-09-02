import { ErrorComponent } from './../../components/error/error.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPhoneDirective } from '../../directives/format-phone.directive';



@NgModule({
    declarations: [
        ErrorComponent,
        FormatPhoneDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [ErrorComponent, FormatPhoneDirective]
})
export class SharedComponentsModule { }
