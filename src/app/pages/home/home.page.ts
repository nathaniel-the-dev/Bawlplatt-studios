import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.css'],
})
export class HomePage {
    @ViewChild('header') header: any;

    constructor() {}
}
