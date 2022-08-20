import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiService } from '../shared/ui.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.css']
})
export class DashboardPage implements OnInit, OnDestroy {

    constructor(private route: ActivatedRoute, private uiService: UiService) { }

    ngOnInit(): void {
        this.setHeaderStyle('hidden');
    }
    ngOnDestroy(): void {
        this.setHeaderStyle('full');
    }

    private setHeaderStyle(style: string) {
        this.uiService.headerStyle.next(style);
    }
}
