import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
    selector: 'base-error',
    template: `
        <span class="inline-flex gap-1 items-center whitespace-nowrap">
            <svg
                id="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke-width="2"
                class="ai ai-CircleAlertFill"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm1 6a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0V7zm0 9.5a1 1 0 1 0-2 0v.5a1 1 0 1 0 2 0v-.5z"
                />
            </svg>
            <ng-content></ng-content>
        </span>
    `,
    styles: [],

    animations: [
        trigger('reveal', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-100%)' }),
                animate(
                    '300ms 0s ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' })
                ),
            ]),
            transition(':leave', [
                style({ opacity: 1, transform: 'translateY(0)' }),
                animate(
                    '300ms 0s ease-in',
                    style({ opacity: 0, transform: 'translateY(-100%)' })
                ),
            ]),
        ]),
    ],
})
export class ErrorComponent implements OnInit {
    @HostBinding('@reveal') trigger = '';

    constructor() {}

    ngOnInit(): void {}
}
