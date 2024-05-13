import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-status-indicator[status]',
    templateUrl: './status-indicator.component.html',
    styleUrls: ['./status-indicator.component.css'],
})
export class StatusIndicatorComponent {
    @Input() status: 'loading' | 'success' | 'error' | '' = '';
    @Input() color?: string = '#fff';
    @Input() bgColor?: string = 'rgb(75 85 99)';
}
