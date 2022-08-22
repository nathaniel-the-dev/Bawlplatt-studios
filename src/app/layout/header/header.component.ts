import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    headerState?: string;

    constructor(private uiService: UiService) {
    }

    ngOnInit(): void {
        this.uiService.headerStyle.subscribe((style: string) => this.headerState = style);
    }

}
