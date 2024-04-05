import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';

const declarations = [SidenavComponent];

const modules = [SharedComponentsModule];

@NgModule({
    declarations: [...declarations],
    imports: [CommonModule, ...modules],
    providers: [AuthService, UserService],
    exports: [...declarations, ...modules],
})
export class AdminSharedModule {}
