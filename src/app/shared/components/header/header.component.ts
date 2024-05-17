import {
    Component,
    Input,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
    @Input() hideOnScroll: boolean = false;
    @ViewChild('header') header!: ElementRef<HTMLElement>;

    private prevScrollPosition: number = 0;
    public showMenu = false;

    get user() {
        return this.apiService.user;
    }

    constructor(private apiService: ApiService) {}

    ngAfterViewInit(): void {
        if (this.hideOnScroll)
            window.addEventListener('scroll', this.hideHeader.bind(this), {
                passive: true,
            });
    }

    toggleMenu() {
        this.showMenu = !this.showMenu;
    }

    hideHeader() {
        window.requestAnimationFrame(() => {
            const currentPosition = window.scrollY;

            if (
                currentPosition > this.prevScrollPosition &&
                !this.header.nativeElement.classList.contains('hide')
            )
                this.header.nativeElement.classList.add('hide');

            if (
                currentPosition < this.prevScrollPosition &&
                this.header.nativeElement.classList.contains('hide')
            )
                this.header.nativeElement.classList.remove('hide');

            this.prevScrollPosition = currentPosition;
        });
    }
}
