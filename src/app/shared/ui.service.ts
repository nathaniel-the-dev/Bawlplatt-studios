import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UiService {
    headerStyle = new BehaviorSubject<string>('full');

    constructor() { }

    scrollToTop() {
        window.scrollTo(0, 0);
    }
}
