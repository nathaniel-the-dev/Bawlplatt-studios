import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { UiService } from './shared/ui.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private uiService: UiService, private router: Router) { }

    ngOnInit(): void {
        // Scroll to top on page navigation
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationStart) this.uiService.scrollToTop();
        })
    }
}
