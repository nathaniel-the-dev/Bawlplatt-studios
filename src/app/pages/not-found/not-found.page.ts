import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.page.html',
    styleUrls: ['./not-found.page.css'],
})
export class NotFoundPage {
    public canGoBack = false;

    constructor(private location: Location) {
        this.canGoBack =
            (this.location.getState() as any).navigationId > 1 ? true : false;
    }

    back() {
        this.location.back();
    }
}
