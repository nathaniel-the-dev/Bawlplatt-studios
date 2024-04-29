import { Component, Input } from '@angular/core';

@Component({
    selector: 'main-dashboard-layout',
    templateUrl: './main.layout.html',
    styleUrls: ['./main.layout.css'],
})
export class MainLayout {
    @Input() title?: string;
}
