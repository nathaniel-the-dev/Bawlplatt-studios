import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.css']
})
export class AboutPage implements OnInit {

    owners: any[] = [
        {
            img: 'https://randomuser.me/api/portraits/men/2.jpg',
            name: 'Liam Hands-Green',
            position: 'Founder'
        },
        {
            img: 'https://randomuser.me/api/portraits/women/90.jpg',
            name: 'Sonia Webb',
            position: 'Bookings Manager'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/46.jpg',
            name: 'Chad Barnett',
            position: 'Studio Manager'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/90.jpg',
            name: 'Brett Holland',
            position: 'Recording Producer'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/80.jpg',
            name: 'Perry Boyd',
            position: 'Mastering Engineer'
        },
        {
            img: 'https://randomuser.me/api/portraits/men/85.jpg',
            name: 'Samuel Gray',
            position: 'Studio Technician'
        },

    ]

    constructor() { }

    ngOnInit(): void {
    }

}
