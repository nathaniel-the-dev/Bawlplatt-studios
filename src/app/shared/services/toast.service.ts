import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    createToast(msg: string, opts?: Toastify.Options) {
        const toast = Toastify({
            text: msg,
            duration: 3000,
            close: true,
            className: 'toast',
            ...opts
        })

        return toast;
    }

    constructor() { }
}
