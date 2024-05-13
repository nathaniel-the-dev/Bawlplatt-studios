import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostBinding,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[passwordToggle]',
})
export class PasswordToggleDirective implements AfterViewInit {
    constructor(
        private el: ElementRef<HTMLInputElement>,
        private renderer: Renderer2
    ) {}

    @HostBinding('type') type = 'password';

    ngAfterViewInit(): void {
        // Only apply to password fields
        if (
            this.el.nativeElement.tagName !== 'INPUT' ||
            this.el.nativeElement.type !== 'password'
        )
            return;

        // Create toggle button
        const btn: HTMLButtonElement = this.renderer.createElement('button');
        let btnSize = 16 * 1.5;
        btn.innerHTML = '<i class="ai-eye-open"></i>';
        this.renderer.setProperty(btn, 'type', 'button');
        this.renderer.setStyle(btn, 'font-size', btnSize + 'px');
        this.renderer.addClass(btn, 'transition-opacity');
        this.renderer.addClass(btn, 'opacity-0');
        this.renderer.addClass(btn, 'peer-hover:opacity-80');
        this.renderer.addClass(btn, 'hover:opacity-80');
        btn.setAttribute('tabindex', '-1');
        btn.setAttribute('aria-hidden', 'true');
        btn.addEventListener('click', this.toggle.bind(this));

        // Calculate button position
        let parentHeight =
            this.el.nativeElement.parentElement?.offsetHeight || 0;
        let inputHeight = this.el.nativeElement.offsetHeight;
        let inputWidth = this.el.nativeElement.offsetWidth;

        let left = inputWidth - btnSize - 10;
        let top =
            parentHeight -
            4 -
            inputHeight +
            inputHeight / 2 -
            (btnSize + 12) / 2;

        this.renderer.addClass(btn, 'absolute');
        this.renderer.setStyle(btn, 'left', `${left}px`);
        this.renderer.setStyle(btn, 'top', `${top}px`);

        // Add button to DOM
        this.renderer.addClass(this.el.nativeElement, '!pr-10');
        this.renderer.addClass(this.el.nativeElement, 'peer');
        this.renderer.addClass(this.el.nativeElement.parentElement, 'relative');
        this.el.nativeElement.insertAdjacentElement('afterend', btn);
    }

    private toggle(event: MouseEvent) {
        let btn = (event.target as any)?.closest('button') as
            | HTMLButtonElement
            | undefined;
        if (!btn) return;

        if (this.type === 'password') {
            this.type = 'text';
            btn.innerHTML = '<i class="ai-eye-slashed"></i>';
        } else {
            this.type = 'password';
            btn.innerHTML = '<i class="ai-eye-open"></i>';
        }
    }
}
