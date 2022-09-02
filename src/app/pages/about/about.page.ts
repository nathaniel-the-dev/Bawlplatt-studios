import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.css']
})
export class AboutPage implements OnInit {

    owners: any[] = [
        {
            img: 'https://randomuser.me/api/portraits/men/64.jpg',
            name: 'Lance Jackson',
            position: 'CEO'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/76.jpg',
            name: 'Lance Jackson',
            position: 'CEO'
        },
        {
            img: 'https://randomuser.me/api/portraits/women/64.jpg',
            name: 'Lance Jackson',
            position: 'CEO'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/12.jpg',
            name: 'Lance Jackson',
            position: 'CEO'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/38.jpg',
            name: 'Lance Jackson',
            position: 'CEO'
        },
        {
            img: 'https://randomuser.me/api/portraits/women/51.jpg',
            name: 'Lance Jackson',
            position: 'CEO'
        },

    ]

    constructor() { }

    ngOnInit(): void {
    }

}
