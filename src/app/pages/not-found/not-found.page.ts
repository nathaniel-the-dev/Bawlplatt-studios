import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.page.html',
    styleUrls: ['./not-found.page.css'],
})
export class NotFoundPage {
    constructor(private location: Location) {}

    back() {
        this.location.back();
    }
}
