import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
    @Input() hideOnScroll: boolean = false;
    @ViewChild('header') header!: ElementRef<HTMLElement>;

    private prevScrollPosition: number = 0;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (this.hideOnScroll) window.addEventListener('scroll', this.hideHeader.bind(this), { passive: true });
    }

    hideHeader(ev: Event) {
        window.requestAnimationFrame(() => {
            const currentPosition = window.scrollY;

            if (currentPosition > this.prevScrollPosition && !this.header.nativeElement.classList.contains('hide'))
                this.header.nativeElement.classList.add('hide');

            if (currentPosition < this.prevScrollPosition && this.header.nativeElement.classList.contains('hide'))
                this.header.nativeElement.classList.remove('hide');

            this.prevScrollPosition = currentPosition;
        })
    }

}
