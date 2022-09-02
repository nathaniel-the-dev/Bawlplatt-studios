import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appFormatPhone]'
})
export class FormatPhoneDirective {
    @HostListener('input', ['$event.data']) onInput(data?: string) {
        const el = this.el.nativeElement;
        if (!el || !data) return;

        if (Number.isInteger(+data)) {
            const input = el.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
            const areaCode = input.substring(0, 3);
            const middle = input.substring(3, 6);
            const last = input.substring(6, 10);

            if (input.length > 6) { el.value = `(${areaCode}) ${middle} - ${last}`; }
            else if (input.length > 3) { el.value = `(${areaCode}) ${middle}`; }
            else if (input.length > 0) { el.value = `(${areaCode}`; }
        }
        else {
            el.value = el.value.slice(0, -1);
        }
    }

    constructor(private el: ElementRef) {
    }

}
